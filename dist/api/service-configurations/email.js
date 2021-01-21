"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendVerificationEmail = void 0;
const emails_1 = require("../domain/services/emails");
const dummyEmailSender = async (emailData) => {
    console.log('emailData :>> ', emailData);
    return true;
};
exports.sendVerificationEmail = () => (new emails_1.SendVerificationEmail({
    sendEmail: dummyEmailSender,
    repositoryGateway: (() => ({}))
}));
exports.sendResetPasswordEmail = () => (new emails_1.SendResetPasswordEmail({
    sendEmail: dummyEmailSender,
    repositoryGateway: (() => ({}))
}));
