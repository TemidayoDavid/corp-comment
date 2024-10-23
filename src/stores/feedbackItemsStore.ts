import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";

type Store = {
  feedbackItem: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  selectedCompany: string;
  getCompanyList: () => string[];
  getfilteredFeedbackItem: () => TFeedbackItem[];
  addItemToList: (text: string) => Promise<void>;
  selectCompany: (company: string) => void;
  fetchFeedbackItems: () => Promise<void>;
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  feedbackItem: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",
  getCompanyList: () => {
    return get()
      .feedbackItem.map((item) => item.company)
      .filter((company, index, array) => {
        return array.indexOf(company) === index;
      });
  },
  getfilteredFeedbackItem: () => {
    const state = get();

    return state.selectedCompany
      ? state.feedbackItem.filter(
          (feedbackItem) => feedbackItem.company === state.selectedCompany
        )
      : state.feedbackItem;
  },
  addItemToList: async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);
    const newItem: TFeedbackItem = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
    };

    set((state) => ({
      feedbackItem: [...state.feedbackItem, newItem],
    }));
    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  selectCompany: (company: string) => {
    set(() => ({
      selectedCompany: company,
    }));
  },
  fetchFeedbackItems: async () => {
    set(() => ({
      isLoading: true,
    }));

    try {
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      set(() => ({
        feedbackItem: data.feedbacks,
      }));
    } catch (error) {
      set(() => ({
        errorMessage: "Something went wrong. Please try again",
      }));
    }

    set(() => ({
      isLoading: false,
    }));
  },
}));
