let Privatemessage = class Privatemessage {
    constructor(fetch) {
        this.fetch = fetch;
    }
    async getPrivatemessages(sessionId, pageIndex = 0) {
        let response = await this.fetch('https://elyco.itslearning.com/restapi/personal/instantmessages/messagethreads/v2?threadPage=0&maxThreadCount=' + (10 * (1 + pageIndex)), {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
                }
            })
            .then(res => res.json())
            .then(body => {
                if (body.Message) {
                    return {
                        status: false,
                        message: body.Message
                    };
                } else {
                    return {
                        status: true,
                        message: body
                    };

                }
            })
            .catch(err => {
                console.log(err);
            });

        return response;


    }
    formatPrivatemessages(privatemessages) {
        let messagesResult = [];
        for (let i = 0; i < privatemessages.EntityArray.length; i++) {
            let message = privatemessages.EntityArray[i];
            messagesResult.push({
                convId: message.InstantMessageThreadId,
                createdDate: message.Created,
                createdByTeacher: message.CreatedByTeacher,
                type: message.Type,
                participants: [],
                lastMessage: {
                    created: message.LastMessage.CreatedFormatted,
                    author: message.LastMessage.CreatedBy,
                    authorName: message.LastMessage.CreatedByName,
                    authorAvatarUrl: message.LastMessage.CreatedByAvatar,
                    text: message.LastMessage.Text,
                    attachmentName: message.LastMessage.AttachmentName,
                    attachmentUrl: message.LastMessage.AttachmentUrl
                }
            })
            for (let j = 0; j < message.Participants.length; j++) {
                messagesResult[i].participants.push({
                    name: message.Participants[j].FullName,
                    personId: message.Participants[j].PersonId,
                    avatarUrl: message.Participants[j].ProfileImageUrl
                });
            }

        }
        return {
            status: true,
            privatemessages: messagesResult
        };
    }
    formatConv(conv, convId) {
        let convResult = {}
        conv = conv.EntityArray.filter(conv => conv.InstantMessageThreadId == convId);
        conv = conv[0];
        convResult = {
            convId: conv.InstantMessageThreadId,
            createdDate: conv.Created,
            createdByTeacher: conv.CreatedByTeacher,
            type: conv.Type,
            isBlocked: conv.IsBlocked,
            isAbuse: conv.IsAbuse,
            readOnly: conv.OnlyThreadAdminCanSendToThread,
            participants: [],
            messages: []
        }
        for (let i = 0; i < conv.Participants.length; i++) {
            convResult.participants.push({
                name: conv.Participants[i].FullName,
                personId: conv.Participants[i].PersonId,
                avatarUrl: conv.Participants[i].ProfileImageUrl
            });
        }
        for (let i = 0; i < conv.Messages.EntityArray.length; i++) {
            convResult.messages.push({
                created: conv.Messages.EntityArray[i].CreatedFormatted,
                author: conv.Messages.EntityArray[i].CreatedBy,
                authorName: conv.Messages.EntityArray[i].CreatedByName,
                authorAvatarUrl: conv.Messages.EntityArray[i].CreatedByAvatar,
                text: conv.Messages.EntityArray[i].Text,
                attachmentName: conv.Messages.EntityArray[i].AttachmentName,
                attachmentUrl: conv.Messages.EntityArray[i].AttachmentUrl,
                isDelete: conv.Messages.EntityArray[i].IsDelete,
                isAbuse: conv.Messages.EntityArray[i].IsAbuse,
                messageId: conv.Messages.EntityArray[i].MessageId
            });
        }
        return {
            status: true,
            conv: convResult
        };
    }

    async send(sessionId, antiforgeryToken, convId, text) {
        return this.fetch("https://elyco.itslearning.com/restapi/personal/instantmessages/v2", {
                "headers": {
                    "__itsl_antiforgery_token__": antiforgeryToken,
                    "content-type": "application/json; charset=UTF-8",
                    "cookie": "ASP.NET_SessionId=" + sessionId,
                },
                "body": JSON.stringify({
                    "InstantMessageThreadId": parseInt(convId),
                    "Text": text
                }),
                "method": "POST",
            })
            .then(res => res.json())
            .then(res => {
                if (res.Message) {
                    return {
                        status: false,
                        message: res.Message
                    };
                } else {
                    return {
                        status: true,
                        message: "Message envoyé"
                    };

                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    async getUnSeenPrivateMessages(sessionId) {
        let response = await this.fetch(`https://elyco.itslearning.com/RestApi/keepalive/online/v1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
                }
            }).then(res => res.json())
            .then(body => {
                return {
                    status: true,
                    nbrunseen: body.UnreadMessages,
                    message: 'Succès'
                };
            }).catch(err => {
                return {
                    status: false,
                    message: err
                }
            });
        return response;
    }
}
module.exports = Privatemessage;