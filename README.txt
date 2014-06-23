

2.5) for #activities (done), #standards, #appointments .Model p move draggable association to rendered function as I did for calendarDay so entire body won't be re-rendered when a new item is added to the list.  For example appointmentItem.js.
3)  invite group dialog:  putting checklist buttons in <p> tags creates a vertcial stack. How to put 4 horizontally, then place the </p><p> to
make a grid?  (now better, but need to figure out how to handle lots of students and multiple sections)
make some functions for things like adding and removing users from group and invite lists (still to do), and creating the group text (done), date formats?
more fields in user profile:  block, firstname, last name, nick name
blocks in calendar???  keeping track of sort orders (both calendar and activities in main list)?



4)  Reassessment - make activities for: go over past assessment, additional practice, and the test date itself available to drag to the calendar. Hover text is standards list. 
6)  add school calendar and meeting category to third tab
5)  Teacher view - all fields editable, drag assessment to main activities list, groups students where possible, add student's names to title of calendar events.
6)  Progress tracker tab.
keep it separate so it doesn't clutter the activities tab ... or is it better to do it in one?
7)  Hover texts for standards, (activities?), hover text is group for calendar events (done)
8)  Add links, to-do lists and comments to student activity view.
9)  meetings dragged to calendar should be a hyperlink opening to form
with links, purpose, and comments (just use the same activity form for all activities?)
10)  Make it an SBG gradebook ??? by allowing LOM's and comments, click on standard to see it's history.  click on assessment to see it's LOM's and comments, hover on assessment to see it's standards and LOM's, show LOM's in standards tab so organized by model, 
11)  improve drag to calendar ... allow new event to occupy proper place in list, put placeholder always at the bottom of the list and don't allow dragging elsewhere until it's dropped, or highlight the whole day rather than use a placeholder (& actually this would eliminate the only direct DOM manipulation in the code, the placing and deleting of placeholders, although not sure I want to do the CSS for coloring the calendar days through the database ... too costly? ... model in calendarEvents.js droppable)
12)  calendar, put min and max days on both date selectors and keep them updated, show at least one week of calendar, disable delete for past events?
13)  Open Invitations counter and pop-up info box or drop down in header of student page. ... revise to put next to models and activities.
14)  DATES:  use format for storeing dates from activity_page.js.
15)  On logout should go back to main page and not stay on activity sub-page ... when following a link and returning to an activity, group info is not saved, causing an error. Return to just-me?  Add a drop-down list for all recent groups?
16)  sort messages with most recent first, include say the five most recent and then have a more button or allow to scroll
17)  hallo editor:  get link button to work (done), get icons for ALL buttons, not just some, make my post button part of the toolbar


DONE
1)  Move sortable association to calendarDay and do it by id ... not
necessary to do it by id:  $(this.find('.daysActivities')).sortable( SortOpt('.daysActivities') );
2) (alternative ... add date to activity when it's put in the calendar, then move all activities back to their proper dates when the calendar is re-drawn)
Later will have to add activities from server when creating new rows.
2)  Just remove or append rows to calendar when dates change rather than redraw the whole thing.
put in calendar code for max/min on end/start datepickers  
These were both dead ends.  Finally decided to record dates and user by creating new activity in meteor database (Activities.insert) and render the calendar again each time there were changes.
2)  calendarDay helper renders activities for current user and date.  Dragging activity to calendar creates new activity with modified user and date fields.  Then the drag/sortable "helper" is canceled so that meteor can render the new activity.  When dates added to calendar, let meteor re-render the whole thing. ... done, but didn't do it quite exactly like this.
3)  highlighting is a problem - try reproducing ui-state-default with my own css, then modifying it ??? (figured it out, then simplified ... done)
handle username for header in activity if called from acvity list rather than calendar (and therefore has no group). (done)
for header text, pass group array and not eventID (done)
Focus just on the grouping and in-class/out-of-class features of the student activity view. (done)
***invite and accept dialogs, also require selecting in-class and out-of-class, and some way this is highlighted in the calendar. (done)

Installation Notes:

procedure:  mrt add jquery-ui-bootstrap
copy .js file from /packages/jquery-ui/lib to /client/lib-... 
mrt remove jquery-ui
delete link to jquery-ui directory from packages
for some reason, meteor does not find jquery-ui when its installed
as a package, but does find it when its copied to client/lib
still want jquery-ui-bootstrap, because it makes a noticeably nicer-looking
interface, so need mrt add bootstrap as well

In upgrading from jquery1.9.4 to jquery1.10.4, I found it was better just to put the files into client/lib instead of installing packages.  Don't know why.  So client/lib now has:
images	(directory)	jquery-ui-1.10.3.custom.css
jquery-te-1.4.0.css	jquery.ui.1.10.3.ie.css
jquery-te-1.4.0.min.js	jquery-ui-1.10.3.theme.css
jquery-te.png		jquery-ui-1.10.4.custom.min.js
jquery-te perhaps to be relaced by Hallo or something else as it's buttons aren't showing up. images and css from jquery-ui-bootstrap project (straight from the latest version of the project consistent with jquery-1.10+ rather than the unmaintained and out of date meteor package), and the jquery-ui-custom.min is straight from jquery-ui rather than from the meteor packages, too.


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

progress:  6/21/14:  'hallo incorporated into openlab.  How I did it:  mrt add bower, hallo added with bower, which pulled in dependencies like jquery-ui, and supposedly fontawesome, installed jquery-ui-bootstarp straight from mrt. did not work from bower.  but jquery-ui has to be installed in /client/lib without the package.  don't like having to install some things in /client/lib, some as regular mrt packages and some as mrt bower and then putting the bower listings in smart.json.  cant I do them all the same way?  REMAINING problems ... only some hallow buttons show up ... my colors for inclass, etc aren't working.'

