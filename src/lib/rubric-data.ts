import { RubricData } from "@/types";

export const rubricData: RubricData = {
  ratingLevels: {
    "0": "Never",
    "1": "Beginner",
    "2": "Growing",
    "3": "Expert",
  },
  skillCategories: [
    {
      categoryName: "Self-Awareness, Social Awareness",
      criteria: [
        {
          id: "sa_1",
          text: "The student can name and express how they or others feel.",
          example: "e.g. uses words like happy, sad, angry, excited",
        },
      ],
    },
    {
      categoryName: "Self Awareness",
      criteria: [
        {
          id: "sa_2",
          text: "The student can express their likes and dislikes.",
          example: "e.g. “I like drawing,” “I don't want to play that”",
        },
      ],
    },
    {
      categoryName: "Self- Management, Metacognition",
      criteria: [
        {
          id: "sa_3",
          text: "The student keeps trying even when a task is difficult.",
          example: "e.g. continues working on a puzzle or writing",
        },
      ],
    },
    {
      categoryName: "Metacognition,  Critical Thinking",
      criteria: [
        {
          id: "sm_1",
          text: "The student is able to ask for help when something is hard.",
          example: "e.g. says “I need help,” or asks a friend",
        },
      ],
    },
    {
      categoryName: "Empathy, Social Awareness",
      criteria: [
        {
          id: "sm_2",
          text: "The student is able to recognize the emotions of others and respond kindly.",
          example: "e.g. helps a crying friend",
        },
      ],
    },
    {
      categoryName: "Empathy, Relationship Skills",
      criteria: [
        {
          id: "sm_3",
          text: "The student shows care when someone is hurt or sad.",
          example: "e.g. checks on them, offers a hug, says kind words",
        },
      ],
    },
    {
      categoryName: "Responsible Decision-Making, Critical Thinking",
      criteria: [
        {
          id: "sm_4",
          text: "The student is able to solve problems with peers peacefully.",
          example: "e.g. takes turns, talks it out",
        },
      ],
    },
    {
      categoryName: "Self-Management",
      criteria: [
        {
          id: "sm_5",
          text: "The student is able to calm down when upset or excited.",
          example: "e.g. takes deep breaths, walks away, asks for a break",
        },
      ],
    },
    {
      categoryName: "Self-Management, Responsible Decision-Making",
      criteria: [
        {
          id: "sm_6",
          text: "The student can stop and think before acting.",
          example:
            "e.g. waits their turn, follows directions instead of rushing",
        },
      ],
    },
    {
      categoryName: "Metacognition, Self-Awareness",
      criteria: [
        {
          id: "sm_7",
          text: "The student is aware of their strengths and areas they want to improve.",
          example: "e.g. “I'm good at drawing...",
        },
      ],
    },
    {
      categoryName: "Metacognition",
      criteria: [
        {
          id: "sm_8",
          text: "The student can say what they want to learn or get better at.",
          example: "e.g. “I want to read more books”",
        },
      ],
    },
  ],
};
