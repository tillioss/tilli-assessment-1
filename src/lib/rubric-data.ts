import { RubricData } from "@/types";

export const rubricData: RubricData = {
  studentName: "Ishani",
  ratingLevels: {
    "1": "Beginner",
    "2": "Growing",
    "3": "Expert",
  },
  skillCategories: [
    {
      categoryName: "Self Awareness",
      criteria: [
        {
          id: "sa_1",
          text: "The student is able to express their basic emotions using appropriate vocabulary (happy, sad, angry, surprised).",
          example: "e.g. I am sad, I am feeling a little angry, I am scared",
        },
        {
          id: "sa_2",
          text: "The student is able to communicate their preferences (likes and dislikes).",
          example:
            "e.g. I am tired now and would like to rest, I would like to draw this instead of writing",
        },
        {
          id: "sa_3",
          text: "The student can communicate their strengths and weaknesses.",
          example: "e.g. I am good at drawing, I want to get better at math",
        },
      ],
    },
    {
      categoryName: "Self Management",
      criteria: [
        {
          id: "sm_1",
          text: "The student is able to communicate their needs when feeling a difficult emotion like anger, frustration, or anxiety.",
          example:
            "e.g. Student asks for help when frustrated instead of disturbing a peer",
        },
        {
          id: "sm_2",
          text: "The student is able to recognize the emotions of others and respond accordingly.",
          example:
            "e.g. Will help a friend who is crying, Notices when someone is upset",
        },
        {
          id: "sm_3",
          text: "The student is able to resolve a conflict with a peer without the help of an adult.",
          example:
            "e.g. Student negotiates/discusses with a peer and resolves a conflict without hitting/scolding them",
        },
        {
          id: "sm_4",
          text: "The student is able to control their impulses and pay attention to a given task.",
          example:
            "e.g. If there is a loud noise while you are teaching, the student doesn't get distracted",
        },
      ],
    },
  ],
};
