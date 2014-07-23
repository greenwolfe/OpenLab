

2.5) for #activities (done), #standards, #appointments .Model p move draggable association to rendered function as I did for calendarDay so entire body won't be re-rendered when a new item is added to the list.  For example appointmentItem.js.
also move accordion, sortable applications to rendered callbacks of specific templates. #activities (done), #standards, #appointments
3)  more fields in user profile:  block, firstname, last name, nick name(x not needed, using username but need validation) (and add to edit profile modal)
blocks in calendar???  keeping track of sort orders (both calendar and activities in main list and todo items )?
4)  Reassessment - make activities for: go over past assessment, additional practice, and the test date itself available to drag to the calendar. Hover text is standards list. ... or just keep track of this on that reassessment's page in the todo list or the notes and drag it several places on the calendar.
6)  add school calendar and meeting category to third tab
5)  Teacher view - all fields editable, drag assessment to main activities list (? or just require students to build their assessment and put it in their calendar?), groups students where possible, add student's names to title of calendar events.
9)  meetings dragged to calendar should be a hyperlink opening to form .
with links, purpose, and comments (just use the same activity form for all activities? yes!)
10)  Make it an SBG gradebook ??? by allowing LOM's and comments, click on standard to see it's history.  click on assessment to see it's LOM's and comments, hover on assessment to see it's standards and LOM's, show LOM's in standards tab so organized by model, 
11)  improve drag to calendar ... allow new event to occupy proper place in list, put placeholder always at the bottom of the list and don't allow dragging elsewhere until it's dropped, or highlight the whole day rather than use a placeholder (& actually this would eliminate the only direct DOM manipulation in the code, the placing and deleting of placeholders, although not sure I want to do the CSS for coloring the calendar days through the database ... too costly? ... model in calendarEvents.js droppable)
12)  calendar, put min and max days on both date selectors and keep them updated, show at least one week of calendar, disable delete for past events?
14)  DATES:  consider using format for storeing dates from activity_page.js. 
15)   Add a drop-down list for all recent groups on activity page. (now to be recent group partners and a full selection menu for teacher)
16)  sort messages with most recent first, include say the five most recent and then have a more button or allow to scroll ... put add message dialog at the top. (done except for the more button)
17)  hallo editor:  get link button to work (done), get icons for ALL buttons, not just some, make my post button part of the toolbar (?)
23)  Add a visible field to activities (done)and models (done) (and standards and links (done) and notes (done) and todos (done)), add an open/closed eye icon for teacher to show/hide.  For teacher, would want to show, but greyed out or something.  For links, notes, todos, may want to implement update function by passing object rather than single fields.
Standardize all calls to object notation {text:'new text'} instead of positional argument???
**25)  Allow teacher to invite multiple sections ... make the session variable an array ... edit groupies.js to accept sections or users (using try ... except?)  Where else would I have to edit to complete this change?
26)  Take care of last bit of null handling for editing activities ... default text disappears when editor opens.
27)  check calendar events links todos notes ... delete and update functions need to handle cases of teacher with postings to section or all
28)  add functions for posting to all



DONE
1)  Move sortable association to calendarDay and do it by id ... not
necessary to do it by id:  $(this.find('.daysActivities')).sortable( SortOpt('.daysActivities') );
2) (alternative ... add date to activity when it's put in the calendar, then move all activities back to their proper dates when the calendar is re-drawn)
Later will have to add activities from server when creating new rows.
2)  Just remove or append rows to calendar when dates change rather than redraw the whole thing.
put in calendar code for max/min on end/start datepickers  
These were both dead ends.  Finally decided to record dates and user by creating new activity in meteor database (Activities.insert) and render the calendar again each time there were changes.
2)  calendarDay helper renders activities for current user and date.  Dragging activity to calendar creates new activity with modified user and date fields.  Then the drag/sortable "helper" is canceled so that meteor can render the new activity.  When dates added to calendar, let meteor re-render the whole thing. ... done, but didn't do it quite exactly like this.
2.5) make some functions for things like adding and removing users from group and invite lists (still to do), and creating the group text (done), date formats? (done)
3)  highlighting is a problem - try reproducing ui-state-default with my own css, then modifying it ??? (figured it out, then simplified ... done)
handle username for header in activity if called from acvity list rather than calendar (and therefore has no group). (done)
for header text, pass group array and not eventID (done)
3) invite group dialog:  putting checklist buttons in <p> tags creates a vertcial stack. How to put 4 horizontally, then place the </p><p> to
make a grid?  (now better, but need to figure out how to handle lots of students and multiple sections) (done)
6)  Progress tracker tab. (deprecated) ... but would be nice if it were the SBG gradebook, and LOM's showed up in the standards list) ... just use scheduling of main teacher-initiated assessments as the progress tracker.
Focus just on the grouping and in-class/out-of-class features of the student activity view. (done)
7)  Hover texts for standards, (activities?), hover text is group for calendar events (done) (maybe don't need this. detail on page for that standard or activity). (done ... do not need for standards and activities,as they will open in their own separate informatin page)
***invite and accept dialogs, also require selecting in-class and out-of-class, and some way this is highlighted in the calendar. (done)
8)  Add links, to-do lists and comments to student activity view.
13)  Open Invitations counter and pop-up info box or drop down in header of student page. ... revise to put next to models and activities.
15)  On logout should go back to main page and not stay on activity sub-page ... when following a link and returning to an activity, group info is not saved, causing an error. Return to just-me?
18)  hover texts for links say "belongs to ..." just like the to-do items. (done)
19) secure user information by making a method that returns just user nick names (require unique when account created!) to invite_group and teacher's selection lists.  The post method when creating a new calendar event would send the nicknames to the server, which could post by userid.  (Or should the whole record by by nicknames so userIds are never exposed on the client?)  Either these methods, or else at least only publish the list of users after log in.  The difficulty of doing this makes me want to try the method as a solution. (not done ... decided to coninue using usernames but did lock it down so no user info is available unless logged in ... can't see the harm in having userid's as all the post, update and delete functions are also well locked down now.)
20) In router.js, move some subscriptions to individual pages rather than loading them all at once at the start?  (done, teacher subscriptions now in client and are conditional)
21)  re-do viewAs select box in header as a custom-styled dropdown with simple caret ... just not time to figure it out now, and it's good enough (done)
22)  Look into bootstrap-modal for nicer-looking dialoges.  simple attempt broke the functionality, and didn't have time to pursue further. (done)
23) notes on login ... callback right after login - check if teacher (nothing), check if student - check if have a section (present set section dialog box) (done, but box needs a submit button???)
24)  ViewAs dropdown ... should exit on mouseout (handled in a different manner ... done)
24)  Teacher View of calendar ... allow to select one or more of in-class, out-of-class or home, default view being in-class (done)
25)  clean up error when student creates account and gets exception from teacher subscriptions when does not have section yet. ... harmless, but also not right.
26) teacher can't delete calendar events assigned to a section


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

Just taking notes here, when loading, bower pullsin dependencies
Bower:  hallo v1.0.4 successfully installed
Bower:  jquery-ui v1.10.4 successfully installed
Bower:  rangy v1.2.3 successfully installed
Bower:  jquery-htmlclean v1.3.0 successfully installed
Bower:  jquery v1.9.1 successfully installed
some of which are duplicates.  Is this overloading my code with some packages installed in multiple places?  I don't understand package loading and when something would see what.

