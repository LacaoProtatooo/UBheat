import { Star } from "lucide-react";
import {Filter} from 'bad-words'

const MiniReviewCard = ({ review }) => {
  const customFilter = new Filter({ placeHolder: 'x' })

  return (
    <div className="w-full max-w-2xl rounded-lg border bg-card p-6 shadow-sm">
    <div className="flex items-start gap-6">
      {/* User Profile Image */}
      <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
        <img
          src={review.user.image.url || "/api/placeholder/48/48"}
          alt={`${review.user.firstname}'s profile`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1">
        {/* User Info and Rating */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{review.user.firstname}</h3>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-base font-medium">{review.rating}</span>
          </div>
        </div>

        {/* Review Comment */}
        <p className="mt-3 text-base text-gray-600">{customFilter.clean(review.comment)}</p>
      </div>
    </div>
  </div>
  );
};

export default MiniReviewCard;