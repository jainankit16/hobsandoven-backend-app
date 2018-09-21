'use strict';

var path = require('path');
var LoopBackContext = require('loopback-context');
var Jimp = require("jimp");
var _ = require('lodash');
var logger = require('../lib/app-logger');
var mailer = require('../lib/mailer');
var async = require('async');
var app = require('../../server/server');
var configLocal = require('../../server/config.local')

module.exports = function (Users) {

    var models = app.models;

    // Users.disableRemoteMethodByName('upsertWithWhere');
    // Users.disableRemoteMethodByName('upsert');
    // Users.disableRemoteMethodByName('replaceOrCreate');
    // Users.disableRemoteMethodByName('createChangeStream');
    // Users.disableRemoteMethodByName('replaceById');
    // Users.disableRemoteMethodByName('exists');
    // Users.disableRemoteMethodByName('count');
    // Users.disableRemoteMethodByName('patchOrCreate');
    // Users.disableRemoteMethodByName('replaceOrCreate');
    // Users.disableRemoteMethodByName('prototype.__count__accessTokens');
    // Users.disableRemoteMethodByName('prototype.__create__accessTokens');
    // Users.disableRemoteMethodByName('prototype.__delete__accessTokens');
    // Users.disableRemoteMethodByName('prototype.__destroyById__accessTokens');
    // Users.disableRemoteMethodByName('prototype.__get__accessTokens');
    // Users.disableRemoteMethodByName('prototype.__updateById__accessTokens');
    // Users.disableRemoteMethodByName('prototype.__count__UsersProfile');
    // Users.disableRemoteMethodByName('prototype.__destroyById__UsersProfile');
    // Users.disableRemoteMethodByName('prototype.__findById__UsersProfile');
    // Users.disableRemoteMethodByName('prototype.__create__UsersProfile');
    // Users.disableRemoteMethodByName('prototype.__delete__UsersProfile');
    // Users.disableRemoteMethodByName('prototype.__updateById__UsersProfile');
    // Users.disableRemoteMethodByName('prototype.__get__UsersProfile');

    var excludedProperties = [
        'realm',
        'emailVerified',
        'username',
        'verificationToken'
    ];

    Users.beforeRemote('login', function (ctx, res, next) {
        if (ctx.req.body.email){
            next();
        } else {
            logger.debug("Request parameters missing.");
            next(new Error("Bad request!"))
        }
    });

    // send password reset link when requested   
    Users.on('resetPasswordRequest', function (info) {
        var url = info.options.URISegment + '/reset-password?access_token=' + info.accessToken.id;
        info['url'] = url;
        info['subject'] = 'Reset password';
        mailer.send({
            from: 'noreply@serviceo.com',
            to: [info.email],
            template: 'user/reset-password',
            params: {
                ctx: info
            },
        }, function (err, result) {
            if (err) {
                console.log(err);
                logger.debug(err);
                // return Error({ statusCode: 400, message: (err.message) ? err.message : err });
            } else {
                console.log('success')
                logger.debug(result);
                //  return result;
            }
        });

    });

    /*Upload files*/
    Users.upload = function (req, res, options, cb) {
        const currentSetToken = options && options.accessToken.id;
        var user_id = options && options.accessToken.userId;
        if (!currentSetToken) {
            logger.debug({ message: 'Access token mismatched.' });
            cb({ statusCode: 401, code: 'INVALID_TOKEN', message: 'Access token mismatched.' });
        } else if (!user_id) {
            logger.debug({ message: 'Invalid user.' });
            cb({ statusCode: 401, code: 'INVALID_USER', message: 'Invalid user.' });
        } else {
            user_id = user_id.toString(); //to make default folder
            var StorageContainer = Users.app.dataSources.storage.connector;
            StorageContainer.allowedContentTypes = ["image/jpg", "image/jpeg", "image/png"];

            StorageContainer.getContainers(function (err, containers) {

                if (containers.some(function (e) {
                    return e.name == user_id;
                })) {
                    Users.findById(user_id, function (err, user) {
                        if (!user) {
                            logger.debug(err);
                            cb({ statusCode: 401, code: 'INVALID_USER_NOT_EXIT', message: 'User does not exist.' });
                        } else {
                            if (user.picture) {     // remove profile picture thumbnail
                                unlinkUploaded(Users, user_id, user.picture);
                            }

                            if (user.profileImage) {    // remove profile picture thumbnail
                                unlinkUploaded(Users, user_id, user.profileImage);
                            }

                            StorageContainer.upload(req, res, {
                                container: user_id
                            }, function (err, fileObj) {
                                if (err) {
                                    logger.debug(err);
                                    cb(err);
                                } else {
                                    logger.debug(fileObj);
                                    updateProfilesPictures(fileObj, user, cb);
                                }

                            });
                        }
                    });

                } else {
                    StorageContainer.createContainer({
                        name: user_id
                    }, function (err, c) {
                        Users.findById(user_id, function (err, user) {
                            if (!user) {
                                cb({ statusCode: 401, code: 'INVALID_USER_NOT_EXIT', message: 'User does not exist.' });
                            } else {
                                StorageContainer.upload(req, res, {
                                    container: c.name
                                }, function (err, fileObj) {
                                    if (err) {
                                        logger.debug(err);
                                        cb(err);
                                    } else {
                                        logger.debug(fileObj);
                                        updateProfilesPictures(fileObj, user, cb);
                                    }
                                });
                            }
                        });

                    });

                }
            });
        }

    };

    Users.remoteMethod('upload', {
        http: { path: '/upload', verb: 'post' },
        accepts: [
            { arg: 'req', type: 'object', http: { source: 'req' } },
            { arg: 'res', type: 'object', http: { source: 'res' } },
            { arg: 'options', type: 'object', http: 'optionsFromRequest' },
        ],
        returns: { arg: 'status', type: 'string' },
        description: 'Upload user profile picture.',
    });

    /**
     * reset-password not working
     *
     */
    Users.updatePasswordFromToken = (accessToken, __, newPassword, cb) => {
        const buildError = (code, error) => {
            const err = new Error(error);
            err.statusCode = 400;
            err.code = code;
            return err;
        };

        if (!accessToken) {
            cb(buildError('INVALID_TOKEN', 'token is null'));
            return;
        }

        Users.findById(accessToken.userId, function (err, user) {
            if (err) {
                cb(buildError('INVALID_USER', err));
                return;
            };
            user.updateAttribute('password', newPassword, function (err, user) {
                if (err) {
                    cb(buildError('INVALID_OPERATION', err));
                    return;
                }
                // successful,
                // notify that everything is OK!
                var mailObj = {}
                mailObj['name'] = user.firstname + ' ' + user.lastname;
                mailObj['email'] = user.email;
                mailObj['date'] = new Date();
                mailObj['temPath'] = 'user/notify-reset-password';
                mailObj['subject'] = 'Password changed successfully'
                mailer.send({
                    from: 'noreply@serviceo.com',
                    to: [mailObj.email],
                    template: mailObj.temPath,
                    params: {
                        ctx: mailObj,
                    },
                }, function (err, result) {
                    cb(null, []);
                });
            });
        });
    }
    Users.remoteMethod('updatePasswordFromToken', {
        isStatic: true,
        accepts: [{
            arg: 'accessToken',
            type: 'object',
            http: function (ctx) {
                return ctx.req.accessToken;
            }
        },
        { arg: 'access_token', type: 'string', required: true, 'http': { source: 'query' } },
        { arg: 'newPassword', type: 'string', required: true },
        ],
        http: { path: '/update-password-from-token', verb: 'post' },
        returns: { type: 'boolean', arg: 'passwordChanged' }
    });

    /*common method to upload pictures*/
    function updateProfilesPictures(fileObj, user, cb) {
        fileObj.files.file.forEach((filesObject) => {
            let _filesObject = filesObject;
            let id = _filesObject.container;
            let type = _filesObject.type;
            let container = "uploads" + path.sep;
            let url = container + id + path.sep;
            let picture = _filesObject.name;
            let profileImage = picture.split('.')[0] + '_thumb.' + picture.split('.')[1];
            var imgSrcPath = url + picture;
            var imgDestPath = url + profileImage;

            Jimp.read(imgSrcPath).then(function (image) {
                image.resize(200, 200).write(imgDestPath, function (err, img) {
                    if (err) {
                        logger.debug(err);
                        return err;
                    } else {
                        uploadUserProfilePicture(user, url, picture, profileImage, cb);
                    }
                })
            }).catch(function (err) {
                logger.debug(err);
                console.error(err);
            });
        });
    }
    /*end of common method to upload pictures*/

    function uploadUserProfilePicture(user, url, picture, profileImage, cb) {
        user.updateAttributes({
            picture: picture,
            url: url,
            profileImage: profileImage
        }, function (err, user) {
            if (err) {
                logger.debug(err);
                return err;
            } else {
                logger.debug(user);
                cb(null, {
                    success: {
                        statusCode: 200,
                        code: 'OK',
                        message: "Your profile picture has been saved successfully.",
                        usr: user
                    }
                });
            }
        });
    }

    // Returns null if the access token is not valid
    function getCurrentTokenId() {
        var ctx = LoopBackContext.getCurrentContext();
        var tokenId = ctx.active.accessToken && ctx.active.accessToken.id;
        return tokenId;
    }

    //remove from folder if uploade
    function unlinkUploaded(Model, user_id, picture) {
        var StorageContainer = Model.app.dataSources.storage.connector;
        StorageContainer.removeFile(user_id, picture, function () {
            return true;
        });
    }

    Users.adminAccessPermission = function (req, options, cb) {
        const token = options && options.accessToken;
        const userId = token && token.userId;
        if (userId) {
            Users.findById(userId, {
                fields: ['userTypeId', 'accessType'],
                include: {
                    relation: 'userType',
                    scope: {
                        fields: ['slug'],
                    },
                },
            }, function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    var res = false;
                    var userType = data['__data'] ? data['__data']['userType'] ? data['__data']['userType']['__data'] : '' : '';
                    if (userType && userType.slug && (userType.slug.toLowerCase() == 'admin' || userType.slug.toLowerCase() == 'super-admin')) {
                        res = true;
                    }
                    cb(null, res);
                }
            });
        } else {
            cb(null);
        }
    };
    
    Users.passwordGenerator = function (req, cb) {
        if (req['length']) {
            const length = req['length'];
            const key = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*ABCDEFGHIJKLMNOP1234567890';
            let pass = '';
            for (let x = 0; x < length; x++) {
                const i = Math.floor(Math.random() * key.length);
                pass += key.charAt(i);
            }
            cb(null, pass);
        } else {
            cb('Password length required !', null)
        }
    };

    function sendMailToNewUser(reqObj, cb) {
        var eMailObj = {};
        eMailObj['subject'] = 'User created successfully';
        eMailObj['url'] = 'https://oak.serviceo.me/login';
        eMailObj['templatePath'] = 'user/registration'
        eMailObj['toEmail'] = reqObj['type'] === 'user' ? reqObj['user']['email'] : reqObj['contact']['Email'];
        eMailObj['user'] = reqObj['type'] === 'user' ? reqObj['user'] : reqObj['contact'];
        models.EmailService.sendEmail(eMailObj, function (err, data) {
            if (err) {
                cb(new Error('Record updated successfully, but failed to send an email notification to user!'), null);
            } else {
                cb(null, 'SUCCESS');
            }
        });
    }

    Users.remoteMethod('adminAccessPermission', {
        accepts: [
            { arg: 'req', type: 'object' },
            { arg: 'options', type: 'object', http: 'optionsFromRequest' },
        ],
        returns: { arg: 'data', type: 'object', root: true },
        description: 'This method will return admin Access Permission.',
    });

    Users.remoteMethod('passwordGenerator', {
        accepts: [
            { arg: 'req', type: 'object' }
        ],
        returns: { arg: 'data', type: 'object', root: true },
        description: 'This method will be return a random password.',
    });

    // modify users login
    Users.afterRemote('login', function (context, user, next) {
        // For check accessToken having userdetail or not
        if (user['__data'].user) {
            var accessType = user['__data'].user.accessType;
            var redirectUrl = '';
            switch (accessType) {
                case 'partner':
                    redirectUrl = '/pms';
                    break;
                case 'vendor':
                    redirectUrl = '/vms';
                    break;
                case 'internal':
                    redirectUrl = '/pms';
                    break;
            }
            if (context && context.req && context.req.body && context.req.body.app === 'admin') {
                redirectUrl = "/admin";
            }
            user['__data']['redirectUrl'] = redirectUrl;
            user['__data'].user.redirectUrl = redirectUrl;
        }

        next();
    });

    Users.remoteMethod('destroyToken', {
        accepts: [
            {
                arg: 'req',
                type: 'object',
                required: true,
                http: {
                    source: 'body'
                }
            }
        ],
        returns: { arg: 'data', type: 'object', root: true },
        description: 'This method used to destroy token for the user.',
    });

    /** method to manage user skill based on current user */
    Users.destroyToken = function (req, cb) {
        if (req && req.tokenId) {
            models.AccessToken.destroyAll({
                id: req.tokenId
            }, function (err, data) {
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, data);
                }
            });
        } else {
            cb('param missing', null);
        }
    };
}
