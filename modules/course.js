let Course = class Course {
    constructor(fetch, https) {
        this.fetch = fetch;
        this.https = https;
    }
    async getCoursesPreview(sessionId) {
        let response = await this.fetch('https://elyco.itslearning.com/Course/AllCourses.aspx', {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                return {
                    status: true,
                    message: body
                };
            })
            .catch(err => {
                return {
                    status: false,
                    message: err
                };
            });
        return response;
    }
    formatCoursesPreview(coursesPreview) {
        try {
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
            return {
                status: true,
                courses: coursesResult
            };
        } catch (err) {
            return {
                status: false,
                message: err
            };
        }
    }
    async getCourseDetail(sessionId, courseId) {
        let response = await this.fetch('https://elyco.itslearning.com/Course/course.aspx?CourseId=' + courseId, {
                method: 'GET',
                headers: {
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
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
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
                }
            })
            .then(res => res.text())
            .then(body => {
                return {
                    status: true,
                    message: body
                };
            })
            .catch(err => {
                return {
                    status: false,
                    message: err
                };
            });

        return {
            status: true,
            message: {
                course: response,
                planner: response2
            }
        }
    }
    formatCourseDetail(course) {
        try {
            let courseDetailsResult = {
                courseName: '',
                dernModif: [],
                actu: [],
                plan: []
            };
            let preview = course.course;
            let planner = course.planner.message;

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

            return {
                status: true,
                data: courseDetailsResult
            }
        } catch (err) {
            return {
                status: false,
                message: err
            }
        }
    }

    async getPlan(sessionId, courseId, planId) {
        let response = await this.fetch('https://elyco.itslearning.com/RestApi/planner/plan/multiple/forTopic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Cookie': `ASP.NET_SessionId=${sessionId}`
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
                return {
                    status: true,
                    message: body
                };
            })
            .catch(err => {
                return {
                    status: false,
                    message: err
                };
            });
        return response
    }
    formatPlan(plan) {
        let planDetailsResult = [];
        let titleRegex = plan.match(/(<span class="itsl-plan-title-label">.[^<]+)/gm);
        let title = [];
        titleRegex.forEach(plan => {
            title.push(plan.replace(/(<span class="itsl-plan-title-label">)/gm, ''));
        });
        let dateRegex = plan.match(/(<span class="itsl-inline-date-picker-view">.[^<]+)/gm);
        let date = [];
        dateRegex.forEach(plan => {
            date.push(plan.replace(/(<span class="itsl-inline-date-picker-view">)/gm, ''));
        });
        let descriptionRegex = plan.match(/(this, event, [0-9]*,[0-9]*\);">\s*.[^\n]+)/gm) || [];
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
        let resBlocRegex = plan.match(/(<div class="gridcolumn-?1?-?1? ">(\s*.*){14})/gm);
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
        return {
            status: true,
            plan: planDetailsResult
        };
    }
    async getdocurl(sessionId, LocationID, ElementID, ElementType, passStep1) {
        try {
            let iframeUrl = ''
            if (!passStep1) {
                let response = await this.fetch('https://elyco.itslearning.com/ContentArea/ContentArea.aspx?LocationType=1&LocationID=' + LocationID + '&ElementID=' + ElementID + '&ElementType=' + ElementType + '&FromNotification=True', {
                        method: 'GET',
                        headers: {
                            'Cookie': `ASP.NET_SessionId=${sessionId}`
                        }
                    })
                    .then(res => res.text())
                    .then(data => {
                        return data;
                    })
                let iframeUrlRegex = response.match(/<iframe src=".[^"]*/gm)[0]
                iframeUrl = 'https://elyco.itslearning.com' + iframeUrlRegex.replace(/<iframe src="/gm, '');
            } else {
                iframeUrl = 'https://elyco.itslearning.com/LearningToolElement/ViewLearningToolElement.aspx?LearningToolElementId=' + LocationID
            }
            let response2 = await this.fetch(iframeUrl, {
                    method: 'GET',
                    headers: {
                        'Cookie': `ASP.NET_SessionId=${sessionId}`
                    }
                })
                .then(res => res.text())
                .then(data => {
                    return data;
                });

            let iframeUrlRegex2 = response2.match(/<iframe src=".[^"]*/gm)[0]
            let iframeUrl2 = iframeUrlRegex2.replace(/<iframe src="/gm, '');
            iframeUrl2 = iframeUrl2.replaceAll('&amp;', '&');
            const resultUrl = new Promise((resolve, reject) => {
                const req3 = this.https.request({
                    hostname: 'platform.itslearning.com',
                    port: 443,
                    path: iframeUrl2.split('https://platform.itslearning.com')[1],
                    method: 'GET'
                }, async(res) => {
                    let cookies = res.headers['set-cookie'];
                    cookies = cookies.map(c => c = c.split(';')[0] + ';');

                    const req4 = this.https.request({
                        hostname: 'platform.itslearning.com',
                        port: 443,
                        path: res.headers.location,
                        method: 'GET',
                        headers: {
                            'Cookie': cookies.join(' ')
                        }
                    }, (res2) => {
                        resolve(res2.headers.location)
                    });
                    req4.on('error', (e) => {
                        console.error(e);
                    });
                    req4.end();
                });

                req3.on('error', (e) => {
                    console.error(e);
                });
                req3.end();
            });
            return {
                status: true,
                url: await resultUrl
            }

        } catch (e) {
            console.log(e)
            return {
                status: false,
                message: 'Une erreur est survenue'
            }
        }

    }
}
module.exports = Course;