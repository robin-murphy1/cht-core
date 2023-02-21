module.exports = [
  {
    name: 'saprin followup',
    icon: 'wcg-cliemt',
    title: 'task.saprim-followup',
    appliesTo: 'reports',
    appliesToType: ['delivery'],
    actions: [{form: 'saprin'}],
    events: [
      {
        id: 'saprin-followup-1',
        days: 7,
        start: 6,
        end: 1,
      },
      {
        id: 'saprin-followup-2',
        days: 14,
        start: 6,
        end: 2,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'delivery',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }
  }
];
