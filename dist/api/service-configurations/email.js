"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendVerificationEmail = void 0;
const emails_1 = require("../domain/services/emails");
const repository_1 = require("../../app-plugins/persistence/repository");
// need to change this to a functional one.
const dummyEmailSender = async (emailData) => {
    return true;
};
exports.sendVerificationEmail = () => (new emails_1.SendEmailVerificationService({
    sendEmail: dummyEmailSender,
    repositoryGateway: new repository_1.UserRepository()
}));
exports.sendResetPasswordEmail = () => (new emails_1.SendResetPasswordService({
    sendEmail: dummyEmailSender,
    repositoryGateway: new repository_1.UserRepository()
}));
