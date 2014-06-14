

2.5) for #activities (done), #standards, #appointments .Model p move draggable association to rendered function as I did for calendarDay so entire body won't be re-rendered when a new item is added to the list.  For example appointmentItem.js.
3)  Focus just on the grouping and in-class/out-of-class features of the student activity view.
invite group dialog:  putting checklist buttons in <p> tags creates a vertcial stack. How to put 4 horizontally, then place the </p><p> to
make a grid?
make some functions for things like adding and removing users from group and invite lists, and creating the group text (done)
more fields in user profile:  block, firstname, last name, nick name
blocks in calendar???  keeping track of sort orders (both calendar and activities in main list)?
***invite and accept dialogs, also require selecting in-class and out-of-class, and some way this is highlighted in the calendar.
*** highlighting is a problem - try reproducing ui-state-default with my own css, then modifying it ???
handle username for header in activity if called from acvity list rather than calendar (and therefore has no group).

4)  Reassessment - make activities for: go over past assessment, additional practice, and the test date itself available to drag to the calendar. Hover text is standards list. 
6)  add school calendar and meeting category to third tab
5)  Teacher view - all fields editable, drag assessment to main activities list, groups students where possible, add student's names to title of calendar events.
6)  Progress tracker tab.
keep it separate so it doesn't clutter the activities tab ... or is it better to do it in one?
7)  Hover texts for standards, (activities?)
8)  Add links, to-do lists and comments to student activity view.
9)  meetings dragged to calendar should be a hyperlink opening to form
with links, purpose, and comments
10)  Make it an SBG gradebook ??? by allowing LOM's and comments, click on standard to see it's history.  click on assessment to see it's LOM's and comments, hover on assessment to see it's standards and LOM's, show LOM's in standards tab so organized by model, 
11)  improve drag to calendar ... allow new event to occupy proper place in list, put placeholder always at the bottom of the list and don't allow dragging elsewhere until it's dropped, or highlight the whole day rather than use a placeholder.

DONE
1)  Move sortable association to calendarDay and do it by id ... not
necessary to do it by id:  $(this.find('.daysActivities')).sortable( SortOpt('.daysActivities') );
2) (alternative ... add date to activity when it's put in the calendar, then move all activities back to their proper dates when the calendar is re-drawn)
Later will have to add activities from server when creating new rows.
2)  Just remove or append rows to calendar when dates change rather than redraw the whole thing.
put in calendar code for max/min on end/start datepickers  
These were both dead ends.  Finally decided to record dates and user by creating new activity in meteor database (Activities.insert) and render the calendar again each time there were changes.
2)  calendarDay helper renders activities for current user and date.  Dragging activity to calendar creates new activity with modified user and date fields.  Then the drag/sortable "helper" is canceled so that meteor can render the new activity.  When dates added to calendar, let meteor re-render the whole thing. ... done, but didn't do it quite exactly like this.

Installation Notes:

procedure:  mrt add jquery-ui-bootstrap
copy .js file from /packages/jquery-ui/lib to /client/lib-... 
mrt remove jquery-ui
delete link to jquery-ui directory from packages
for some reason, meteor does not find jquery-ui when its installed
as a package, but does find it when its copied to client
still want jquery-ui-bootstrap, because it makes a noticeably nicer-looking
interface, so need mrt add bootstrap as well


Programming Notes:
console.log(ui.item[0].className + ' ' + ); //need [0] to get to item properties as it's an array of length 1

    var a = Activities.find({model: this.model, user: { $elemMatch: {id : 'master'}}});
    var count = 0;
    a.forEach(function (activity) {
      console.log("Name of activity " + count + ": " + activity.title);
      count += 1;
    });

Search syntax:
return Activities.find({model: this.model, user: { $elemMatch: {id : 'master'}}});

