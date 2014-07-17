Links = new Meteor.Collection('links');

/*  var link = {
      author : Meteor.userId(),
      group : group,
      submitted : new Date().getTime(),
      activityID : this._id,
      title: title, 
      URL: URL,
      hoverText: hoverText,
      text: constructed from title, URL and hoverText by postLink method,
      visible: true
    } */

Meteor.methods({

  /***** POST LINK ****/
  postLink: function(Link) { 
    var cU = Meteor.user(); //currentUser
    var LinkId,text;

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to post a link");

    if (!Link.author || (cU._id != Link.author))
      throw new Meteor.Error(402, "Only the currently logged in user can post a link.");

    if (!Link.title || (Link.title == 'Title') || (Link.title == ''))
      throw new Meteor.Error(413, "Cannot post link.  Missing title.");

    if (!Link.URL || (Link.URL == 'URL') || (Link.URL == ''))
      throw new Meteor.Error(414, "Cannot post link.  Missing URL.");
    //could do more validation of the URL here

    text  =  '<a href="' + Link.URL + '" title="' + Link.hoverText +'">' + Link.title + "</a>";
    Link.text = text;

    if (!Link.hasOwnProperty('visible'))
      Link.visible = true;

    if (!Link.hasOwnProperty('group') || !_.isArray(Link.group))
      throw new Meteor.Error(402, "Cannot post link.  Improper group.");

    //need code to handle _ALL_ or blocks
    Link.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot post link.  Group members must be valid users.");
    });

    if (!Link.hasOwnProperty('activityID') || !Activities.findOne(Link.activityID))
      throw new Meteor.Error(406, "Cannot post link.  Invalid activity ID.");

    if (!Link.submitted)// || !moment(Link.submitted,'ddd[,] MMM D YYYY',true).isValid())
      throw new Meteor.Error(411, "Cannot post link.  Invalid date");

    if (Roles.userIsInRole(cU,'teacher')) {
     LinkID = Links.insert(linkWithText);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Link.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot post link unless you are part of the group.')
      LinkID = Links.insert(linkWithText);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to post a link.')
    };

    return LinkID;
  },

  /***** DELETE LINK ****/
  deleteLink: function(LinkID) { 
    var cU = Meteor.user(); //currentUser
    var Link = Links.findOne(LinkID);

    if (!cU)  
      throw new Meteor.Error(401, "You must be logged in to delete a link");

    if (!Link)
      throw new Meteor.Error(412, "Cannot post link.  Invalid ID.");

    if (!Link.hasOwnProperty('group') || !_.isArray(Link.group))
      throw new Meteor.Error(402, "Cannot delete link.  Improper group.");

    //need code to handle _ALL_ or blocks
    Link.group.forEach(function(memberID) {
      if (!Meteor.users.findOne(memberID))
        throw new Meteor.Error(404, "Cannot delete link.  Group members must be valid users.");
    });

    if (Roles.userIsInRole(cU,'teacher')) {
     Links.remove(LinkID);
    } else if (Roles.userIsInRole(cU,'student')) {
      if (!_.contains(Link.group,cU._id)) 
        throw new Meteor.Error(408, 'Cannot delete link unless you are part of the group.')
      Links.remove(LinkID);
    } else {
      throw new Meteor.Error(409, 'You must be student or teacher to delete a link.')
    };

    return LinkID;
  }

  //need update link to code changes to visible status
});
