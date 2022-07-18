let Notif = class Notif {
    constructor(fetch) {
        this.fetch = fetch;
    }
    async getNotif(clientId) {

        let response = await this.fetch('https://elyco.itslearning.com/RestApi/notifications/getPersonalNotifications', {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                if (body.includes('401 - Unauthorized: Access is denied due to invalid credentials.')) {
                    return false;
                } else {
                    return body;

                }
            })
            .catch(err => {
                console.log(err);
            });

        return response;

    }
    format(notifs) {
        let notifsResult = [];
        let notifsMatiereRegex = notifs.match(/(Nouveau message disponible dans <a title=".[^"]+)/gm) || [];
        let notifsMatiere = [];
        notifsMatiereRegex.forEach(matiere => {
            notifsMatiere.push(matiere.replace(/(Nouveau message disponible dans <a title=")/gm, ''));
        });
        let notifsDateRegex = notifs.match(/(<span class='itsl-widget\-extrainfo'[\s]+title=".[^"]+)/gm) || [];
        let notifsDate = [];
        notifsDateRegex.forEach(date => {
            notifsDate.push(date.replace(/(<span class='itsl-widget\-extrainfo'[\s]+title=")/gm, ''));
        });
        let notifsAuthorRegex = notifs.match(/(<span class="h-va-bottom">.[^<\/span]+)/gm) || [];
        let notifsAuthor = [];
        notifsAuthorRegex.forEach(author => {
            notifsAuthor.push(author.replace(/(<span class="h-va-bottom">)/gm, ''));
        });
        let notifsImgRegex = notifs.match(/(<img class="h-va-middle h-mrr5"[\s]+src=".[^"]+)/gm) || [];
        let notifsImg = [];
        notifsImgRegex.forEach(img => {
            notifsImg.push(img.replace(/(<img class="h-va-middle h-mrr5"[\s]+src=")/gm, ''));
        });

        let notifsCourseIdRegex = notifs.match(/(\/ContentArea\/ContentArea\.aspx\?LocationType=1&amp;LocationID=[0-9]*)/gm) || [];
        let notifsCourseId = [];
        notifsCourseIdRegex.forEach(courseId => {
            notifsCourseId.push(courseId.replace(/(\/ContentArea\/ContentArea\.aspx\?LocationType=1&amp;LocationID=)/gm, ''));
        });
        for (let i = 0; i < notifsAuthor.length; i++) {
            notifsResult.push({
                matiere: notifsMatiere[i],
                date: notifsDate[i],
                author: notifsAuthor[i],
                img: notifsImg[i],
                courseId: notifsCourseId[i]
            });
        }
        return notifsResult;

    }
}
let Message = class Message {
    constructor(fetch) {
        this.fetch = fetch;
    }
    async getMessage(clientId, pageIndex) {
        let response = await this.fetch('https://elyco.itslearning.com/restapi/personal/instantmessages/messagethreads/v2?threadPage=0&maxThreadCount=' + (10 * (1 + pageIndex)), {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.json())
            .then(body => {
                if (body.Message) {
                    return false;
                } else {
                    return body;

                }
            })
            .catch(err => {
                console.log(err);
            });

        return response;
    }
    formatMessagePreview(messages) {
        let messagesResult = [];
        for (let i = 0; i < messages.EntityArray.length; i++) {
            let message = messages.EntityArray[i];
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
        return messagesResult;
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
        return convResult;
    }
    async sendMessage(clientId, antiforgeryToken, convId, text) {
        return this.fetch("https://elyco.itslearning.com/restapi/personal/instantmessages/v2", {
                "headers": {
                    "__itsl_antiforgery_token__": antiforgeryToken,
                    "content-type": "application/json; charset=UTF-8",
                    "cookie": "ASP.NET_SessionId=" + clientId,
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
                    return false;
                } else {
                    return true;

                }
            })
            .catch(err => {
                console.log(err);
            });

    }
    async uploadFile(clientId, antiforgeryToken, file) {
        return this.fetch("https://elyco.itslearning.com/restapi/personal/instantmessages/attachment/v1", {
            "headers": {
                "__itsl_antiforgery_token__": antiforgeryToken,
                "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
                "cookie": "ASP.NET_SessionId=" + clientId + ";",

            },
            "body": `------WebKitFormBoundary7MA4YWxkTrZu0gW
            Content-Disposition: form-data; name="file"; filename="${file.name}"
            Content-Type: ${file.type}
            Content-Transfer-Encoding: binary${file.data}
            ------WebKitFormBoundary7MA4YWxkTrZu0gW--`,
            "method": "POST"
        })

        .then(res => res.json())
            .then(res => {
                if (res.Message) {
                    return false;
                } else {
                    return res;

                }
            })
    }
}

let Courses = class Courses {
    constructor(fetch) {
        this.fetch = fetch;
    }
    async getCoursesPreview(clientId) {
        let response = await this.fetch('https://elyco.itslearning.com/Course/AllCourses.aspx', {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                return body;
            })
            .catch(err => {
                console.log(err);
            });
        return response;
    }
    async getCourses(clientId, courseId) {
        let response = await this.fetch('https://elyco.itslearning.com/Course/course.aspx?CourseId=' + courseId, {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                return body;
            })
            .catch(err => {
                console.log(err);
            });
        let response2 = await this.fetch('https://elyco.itslearning.com/Planner/Planner.aspx?CourseID=' + courseId + '&Filter=-1', {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                return body;
            })
            .catch(err => {
                console.log(err);
            });

        return {
            course: response,
            planner: response2
        }
    }
    async getPlanDetails(clientId, courseId, planId) {
        let response = await this.fetch('https://elyco.itslearning.com/RestApi/planner/plan/multiple/forTopic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                },
                body: JSON.stringify({
                    childId: "0",
                    chunkNumber: 0,
                    chunkSize: 15,
                    courseId: courseId.toString(),
                    currentDisplayMode: "0",
                    dashboardHierarchyId: "0",
                    dashboardName: "",
                    end: "",
                    filter: "",
                    isSearching: false,
                    pageNumber: 1,
                    pageSize: 25,
                    searchText: null,
                    sort: "Order:asc",
                    start: "",
                    topicId: planId.replace('t', '')
                })
            })
            .then(res => res.json())
            .then(body => {
                return body;
            })
            .catch(err => {
                console.log(err);
            });
        return response.gridData;
    }
    async getDoc(clientId, link) {
        let response = await this.fetch(link, {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                return body;
            })
            .catch(err => {
                console.log(err);
            });
        response = response.match(/(<iframe src=".[^"]*)/gm)[0].replace('<iframe src="', '');
        response = "https://elyco.itslearning.com/" + response;
        let response2 = await this.fetch(response, {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${clientId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                return body;
            })
            .catch(err => {
                console.log(err);
            });
        response2 = response2.match(/(<iframe src=".[^"]*)/gm)[0].replace('<iframe src="', '');

        return response2;
    }
    formatCoursesPreview(coursesPreview) {
        let coursesResult = [];
        let coursesNameRegex = coursesPreview.match(/(<span class="">.[^<]+)/gm);
        let coursesName = [];
        coursesNameRegex.forEach(course => {
            coursesName.push(course.replace(/(<span class="">)/gm, ''));
        });
        let coursesDateRegex = coursesPreview.match(/(<td>[0-9|&nbsp;][^<]+)/gm);
        let coursesDate = [];
        for (let i = 0; i < coursesDateRegex.length; i++) {
            if ((i + 2) % 3 == 0) {
                coursesDate.push(coursesDateRegex[i].replace(/(<td>)/gm, ''));
            }
        }

        let coursesIdRegex = coursesPreview.match(/(href="\/main.aspx\?CourseID=[0-9]*)/gm);
        let coursesId = [];
        coursesIdRegex.forEach(course => {
            coursesId.push(course.replace(/(href="\/main.aspx\?CourseID=)/gm, ''));
        });

        for (let i = 0; i < coursesName.length; i++) {
            coursesResult.push({
                name: coursesName[i],
                date: coursesDate[i],
                id: coursesId[i]
            });
        }
        return coursesResult;
    }
    formatCourse(course) {
        let courseDetailsResult = {
            courseName: '',
            dernModif: [],
            actu: [],
            plan: []
        };
        let preview = course.course;
        let planner = course.planner;

        let courseNameRegex = preview.match(/(<title>.[^<]+)/gm);
        courseDetailsResult.courseName = courseNameRegex[0].replace(/(<title>)/gm, '');

        let dernModifAuthorNameRegex = preview.match(/(<span class="h-va-bottom">.[^<]+)/gm) || [];
        let dernModifAuthorName = [];
        dernModifAuthorNameRegex.forEach(course => {
            dernModifAuthorName.push(course.replace(/(<span class="h-va-bottom">)/gm, ''));
        });

        let dernModifAuthorIdRegex = preview.match(/(document\.showProfileCard\([0-9]*)/gm) || [];
        let dernModifAuthorId = [];
        dernModifAuthorIdRegex.forEach(course => {
            dernModifAuthorId.push(course.replace(/(document\.showProfileCard\()/gm, ''));
        });

        let dernModifDateRegex = preview.match(/(<span class='itsl-widget-extrainfo'[\s]+title="[^">]+)/gm) || [];
        let dernModifDate = [];
        dernModifDateRegex.forEach(course => {
            dernModifDate.push(course.replace(/(<span class='itsl-widget-extrainfo'[\s]+title=")/gm, ''));
        });

        let resBlocRegex = preview.match(/(<li>(\s*.*){13})/gm);
        let res = [];
        resBlocRegex.forEach(plan => {
            let resSpecBlocRegex = plan.match(/(<a href=".[^<]*.[^<]*)/gm) || [];
            let resSpec = [];
            resSpecBlocRegex.forEach(resSpecBloc => {
                let resTitleRegex = resSpecBloc.match(/(<span>.[^<]*)/gm) ? resSpecBloc.match(/(<span>.[^<]*)/gm)[0] : '';
                let resTitle = resTitleRegex.replace(/(<span>)/gm, '');
                let resLinkRegex = resSpecBloc.match(/(<a href=".[^"]*)/gm) ? resSpecBloc.match(/(<a href=".[^"]*)/gm)[0] : '';
                let resLink = resLinkRegex.replace(/(<a href=")/gm, '');

                resSpec.push({
                    title: resTitle,
                    link: resLink
                });
            });

            res.push(resSpec);
        });

        for (let i = 0; i < dernModifAuthorName.length; i++) {
            courseDetailsResult.dernModif.push({
                authorName: dernModifAuthorName[i],
                authorId: dernModifAuthorId[i],
                res: res[i],
                date: dernModifDate[i]
            });
        }

        let actuAuthorNameRegex = preview.match(/(<input type="button" value=".[^"]+)/gm) || [];
        let actuAuthorName = [];
        actuAuthorNameRegex.forEach(course => {
            actuAuthorName.push(course.replace(/(<input type="button" value=")/gm, ''));
        });

        let actuAuthorIdRegex = preview.match(/(document\.showProfileCard\([0-9]*)/gm) || [];
        let actuAuthorId = [];
        actuAuthorIdRegex.forEach(course => {
            actuAuthorId.push(course.replace(/(document\.showProfileCard\()/gm, ''));
        });

        let actuAuthorAvatarUrlRegex = preview.match(/(<img class="ccl-commentmodule-img h-mr0 itsl-light-bulletins-authorimage" src=".[^"]+)/gm) || [];
        let actuAuthorAvatarUrl = [];
        actuAuthorAvatarUrlRegex.forEach(course => {
            actuAuthorAvatarUrl.push(course.replace(/(<img class="ccl-commentmodule-img h-mr0 itsl-light-bulletins-authorimage" src=")/gm, ''));
        });

        let actuTextRegex = preview.match(/(data-text=".[^"]+)/gm) || [];
        let actuText = [];
        actuTextRegex.forEach(course => {
            actuText.push(course.replace(/(data-text=")/gm, ''));
        });

        let actuCreatedRegex = preview.match(/(<div title=".[^"]+)/gm) || [];
        let actuCreated = [];
        actuCreatedRegex.forEach(course => {
            actuCreated.push(course.replace(/(<div title=")/gm, ''));
        });
        for (let i = 0; i < actuAuthorName.length; i++) {
            courseDetailsResult.actu.push({
                authorName: actuAuthorName[i],
                authorId: actuAuthorId[i],
                authorAvatarUrl: actuAuthorAvatarUrl[i],
                text: actuText[i],
                created: actuCreated[i]
            });
        }

        let planTitleRegex = planner.match(/(<h2>\s*<span>.[^<]*)/gm) || [];
        let planTitle = [];
        planTitleRegex.forEach(course => {
            planTitle.push(course.replace(/(<h2>\s*<span>)/gm, ''));
        });

        let planNbrRegex = planner.match(/(<span class="itsl-topic-expanded-text">.[^<]+)/gm) || [];
        let planNbr = [];
        planNbrRegex.forEach(course => {
            planNbr.push(course.replace(/(<span class="itsl-topic-expanded-text">)/gm, ''));
        });

        let planDateRegex = planner.match(/(<span class="itsl-topic-dates">.[^<]+)/gm) || [];
        let planDate = [];
        planDateRegex.forEach(course => {
            planDate.push(course.replace(/(<span class="itsl-topic-dates">)/gm, ''));
        });

        let planIdRegex = planner.match(/(<option value="t[0-9]{6}"( selected="selected")?>.[^<]+)/gm) || [];
        let planId = [];
        planIdRegex.forEach(course => {
            planId.push(course.match(/(t[0-9]{6})/gm)[0]);
        });
        for (let i = 0; i < planTitle.length; i++) {

            courseDetailsResult.plan.push({
                title: planTitle[i],
                nbrPlan: planNbr[i],
                dates: planDate[i],
                id: planId[i]
            });
        }

        return courseDetailsResult;
    }

    formatPlanDetails(planHTML, courseId, clientId) {
        let planDetailsResult = [];
        let titleRegex = planHTML.match(/(<span class="itsl-plan-title-label">.[^<]+)/gm);
        let title = [];
        titleRegex.forEach(plan => {
            title.push(plan.replace(/(<span class="itsl-plan-title-label">)/gm, ''));
        });
        let dateRegex = planHTML.match(/(<span class="itsl-inline-date-picker-view">.[^<]+)/gm);
        let date = [];
        dateRegex.forEach(plan => {
            date.push(plan.replace(/(<span class="itsl-inline-date-picker-view">)/gm, ''));
        });
        let descriptionRegex = planHTML.match(/(this, event, [0-9]*,[0-9]*\);">\s*.[^\n]+)/gm) || [];
        let description = [];
        descriptionRegex.forEach(planDescription => {
            description.push(planDescription.replace(/(this, event, [0-9]*,[0-9]*\);">\s*)/gm, ''));
            //     let planId = planDescription.split(',')[2].trim()
            //     let columnId = planDescription.split(',')[3]
            // let response = this.fetch('https://elyco.itslearning.com/RestApi/planner/column/getplanhtmltextcellcontent?courseId=' + courseId + '&planId=' + planId + '&columnId=' + columnId + '&childId=0&filterPersonId=0', {
            //         method: 'GET',
            //         headers: {
            //             'Cookie': `ASP.NET_SessionId=${clientId}`
            //         }
            //     })
            //     .then(response => response.text())
            //     .then(response => {
            //         return response;
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });
            // let descriptionHTMLPart = response.match(/(<div class='h-userinput'>.[^<]+)/gm)[0]
            // descriptionHTMLPart.replace(/(<div class='h-userinput'>)/gm, '');
        });
        let resBlocRegex = planHTML.match(/(<div class="gridcolumn-?1?-?1? ">(\s*.*){14})/gm);
        resBlocRegex.shift();
        let res = [];
        resBlocRegex.forEach(plan => {
            let resSpecBlocRegex = plan.match(/(<li.*)/gm);
            let resSpec = [];
            resSpecBlocRegex.forEach(resSpecBloc => {
                let resTitleRegex = resSpecBloc.match(/(<span>.[^<]*)/gm) ? resSpecBloc.match(/(<span>.[^<]*)/gm)[0] : '';
                let resTitle = resTitleRegex.replace(/(<span>)/gm, '');
                let resLinkRegex = resSpecBloc.match(/(<a class="ccl-iconlink itsl-plan-elements-item-link" href=".[^"]*)/gm) ? resSpecBloc.match(/(<a class="ccl-iconlink itsl-plan-elements-item-link" href=".[^"]*)/gm)[0] : '';
                let resLink = resLinkRegex.replace(/(<a class="ccl-iconlink itsl-plan-elements-item-link" href=")/gm, '');
                let resIconRegex = resSpecBloc.match(/(<img src=".[^"]*)/gm) ? resSpecBloc.match(/(<img src=".[^"]*)/gm)[0] : '';
                let resIcon = resIconRegex.replace(/(<img src=")/gm, '');
                resSpec.push({
                    title: resTitle,
                    link: resLink,
                    icon: resIcon
                });
            });
            res.push(resSpec);
        });
        for (let i = 0; i < title.length; i++) {
            planDetailsResult.push({
                title: title[i],
                date: date[i],
                description: description[i],
                res: res[i]
            });
        }
        return planDetailsResult;

    }

}

module.exports = {
    Notif,
    Message,
    Courses
}