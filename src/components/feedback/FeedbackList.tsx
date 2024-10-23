import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";
import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";

export default function FeedbackList() {

    const isLoading = useFeedbackItemsStore(state => state.isLoading);
    const errorMessage = useFeedbackItemsStore(state => state.errorMessage);
    const filteredFeedbackItem = useFeedbackItemsStore(state => state.getfilteredFeedbackItem());

  return (
    <ol className="feedback-list">
      {isLoading && <Spinner />}

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {filteredFeedbackItem.map((feedbackItem) => (
        <FeedbackItem key={feedbackItem.id} feedbackItem={feedbackItem} />
      ))}
    </ol>
  );
}
