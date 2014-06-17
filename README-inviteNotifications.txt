in header, add html to create dropdown with badge for number of open invites.
in header.js, make a helper that gets a cursor for all open invites ... no sort needed because that's all that's published for this user?
   count total and post with title of dropdown menu.  "You have ___ open invitations.
   count frequency of each activityID/date combo and return array with activity.title and frequency and date of event.  
   pass to inviteNotification helper to say "({{frequency}})-badge invitations to {{title}} on {{date}}
