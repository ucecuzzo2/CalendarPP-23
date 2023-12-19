export const steps = [
  {
    target: "body",
    content: "Here is a short tutorial.",
    title: "Welcome to Calendar++",
    placement: "center",
    showSkipButton: true,
    disableScrollParentFix: true,
  },
  {
    title: "Creating an Event",
    target: "#today",
    content: "You can click a date to create a new event.",
    disableOverlayClose: true,
    hideCloseButton: true,
    hideFooter: true,
    spotlightClicks: true,
    disableScrollParentFix: true,
  },
  {
    title: "Fill out Event Details",
    target: "#chakra-modal-joyride-add-event-modal",
    content:
      "The date you click on will automatically be filled in at the event date. Event title, type and date are required.",
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true,
    hideFooter: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrollParentFix: true,
  },
  {
    title: "Another Way to Add Events",
    target: "#hover-button",
    content:
      "You can hover over this button and a menu will popup showing buttons you ",
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true,
    hideFooter: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrollParentFix: true,
  },
  {
    title: "Click Add Events",
    target: "#add-event-button",
    content: "This button will open a modal to fill out event details.",
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true,
    hideFooter: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrollParentFix: true,
  },
  {
    title: "Fill out Event Details",
    target: "#chakra-modal-joyride-add-event-modal",
    content: "The date will automatically fill in as today's date.",
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true,
    hideFooter: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrollParentFix: true,
  },
  {
    title: "Adding a Class",
    target: "#hover-button",
    content: "Hover over the plus button again",
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true,
    hideFooter: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrollParentFix: true,
  },
  {
    title: "Click Add Class",
    target: "#add-class-button",
    content: "Clicking Add Class will open a modal to add class details",
    disableOverlayClose: true,
    hideCloseButton: true,
    spotlightClicks: true,
    hideFooter: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrollParentFix: true,
  },
  {
    title: "Fill out Class Details",
    target: "#chakra-modal-joyride-add-class-modal",
    content:
      "You can select various options to define when your class is. If its asynchronous check the box and a time won't be required. If your class has set times then fill in the information and it will appear on the calendar for those set days within the current semester. ",
    disableOverlayClose: true,
    placement: "left",
    hideCloseButton: true,
    spotlightClicks: true,
    hideFooter: true,
    styles: {
      options: {
        zIndex: 10000,
      },
    },
    disableScrollParentFix: true,
  },
  {
    title: "You're All Set!",
    target: "body",
    hideFooter: true,
    content:
      "You now know all the basics to get you started better organizing your school schedule! There are more features like canvas integration but it isn't required to start.",
    placement: "center",
    disableScrollParentFix: true,
  },
];
