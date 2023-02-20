module.exports = [
    {
        name: 'saprin followup',
        icon: 'wcg-cliemt.svg',
        title: 'task.saprim-followup',
        appliesTo: 'reports',
        appliesToType: [ 'delivery' ],
        actions: [ { form: 'saprin' } ],
        events: [
            {
                id: 'saprin-followup-1',
                days:7,
                start:2,
                end:2,
            },
            {
                id: 'saprin-followup-2',
                days:14,
                start:2,
                end:2,
            }
        ],
        resolvedIf: function (contact, report, event, dueDate) {
            return Utils.isFormSubmittedInWindow(
                contact.reports,
                'saprin',
                Utils.addDate(dueDate, -event.start).getTime(),
                Utils.addDate(dueDate, event.end + 1).getTime()
            );
        }
    }
];