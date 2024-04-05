interface Feedback {
    id: number;
    username: string;
    text: string;
    rate: number;
    course: string;
  }
  
 export  const feedBacks: Feedback[] = [
    { id: 1, username: "Samandar Jumanov", text: "It is better to use this app rather than not using it.", rate: 4, course: "Dropshipping" },
    { id: 2, username: "John Doe", text: "This app has been incredibly useful for my daily tasks.", rate: 5, course: "Sales" },
    { id: 3, username: "Jane Smith", text: "I found the app to be useful, but it needs some improvements.", rate: 3, course: "Online" },
  ];