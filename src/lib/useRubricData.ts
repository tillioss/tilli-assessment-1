import { useTranslation } from "react-i18next";
import { RubricData } from "@/types";

export const useRubricData = (): RubricData => {
  const { t } = useTranslation();

  return {
    ratingLevels: {
      "0": t("rubric.ratingLevels.0"),
      "1": t("rubric.ratingLevels.1"),
      "2": t("rubric.ratingLevels.2"),
      "3": t("rubric.ratingLevels.3"),
    },
    skillCategories: [
      {
        categoryName: t("rubric.skillCategories.selfAwarenessSocialAwareness"),
        criteria: [
          {
            id: "sa_1",
            text: t("rubric.criteria.sa_1.text"),
            example: t("rubric.criteria.sa_1.example"),
          },
        ],
      },
      {
        categoryName: t("rubric.skillCategories.selfAwareness"),
        criteria: [
          {
            id: "sa_2",
            text: t("rubric.criteria.sa_2.text"),
            example: t("rubric.criteria.sa_2.example"),
          },
        ],
      },
      {
        categoryName: t("rubric.skillCategories.selfManagementMetacognition"),
        criteria: [
          {
            id: "sa_3",
            text: t("rubric.criteria.sa_3.text"),
            example: t("rubric.criteria.sa_3.example"),
          },
        ],
      },
      {
        categoryName: t("rubric.skillCategories.metacognitionCriticalThinking"),
        criteria: [
          {
            id: "sm_1",
            text: t("rubric.criteria.sm_1.text"),
            example: t("rubric.criteria.sm_1.example"),
          },
        ],
      },
      {
        categoryName: t("rubric.skillCategories.empathySocialAwareness"),
        criteria: [
          {
            id: "sm_2",
            text: t("rubric.criteria.sm_2.text"),
            example: t("rubric.criteria.sm_2.example"),
          },
        ],
      },
      {
        categoryName: t("rubric.skillCategories.empathyRelationshipSkills"),
        criteria: [
          {
            id: "sm_3",
            text: t("rubric.criteria.sm_3.text"),
            example: t("rubric.criteria.sm_3.example"),
          },
        ],
      },
      {
        categoryName: t(
          "rubric.skillCategories.responsibleDecisionMakingCriticalThinking"
        ),
        criteria: [
          {
            id: "sm_4",
            text: t("rubric.criteria.sm_4.text"),
            example: t("rubric.criteria.sm_4.example"),
          },
        ],
      },
      {
        categoryName: t("rubric.skillCategories.selfManagement"),
        criteria: [
          {
            id: "sm_5",
            text: t("rubric.criteria.sm_5.text"),
            example: t("rubric.criteria.sm_5.example"),
          },
        ],
      },
      {
        categoryName: t(
          "rubric.skillCategories.selfManagementResponsibleDecisionMaking"
        ),
        criteria: [
          {
            id: "sm_6",
            text: t("rubric.criteria.sm_6.text"),
            example: t("rubric.criteria.sm_6.example"),
          },
        ],
      },
      {
        categoryName: t("rubric.skillCategories.metacognitionSelfAwareness"),
        criteria: [
          {
            id: "sm_7",
            text: t("rubric.criteria.sm_7.text"),
            example: t("rubric.criteria.sm_7.example"),
          },
        ],
      },
      {
        categoryName: t("rubric.skillCategories.metacognition"),
        criteria: [
          {
            id: "sm_8",
            text: t("rubric.criteria.sm_8.text"),
            example: t("rubric.criteria.sm_8.example"),
          },
        ],
      },
    ],
  };
};
