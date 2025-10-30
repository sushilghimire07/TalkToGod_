import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utills";
import { getLanguageFlag } from "../lib/language.jsx";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs?.length) {
      outgoingFriendReqs.forEach((req) => outgoingIds.add(req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90 min-h-screen">
      <div className="container mx-auto space-y-10">

        {/* Friends Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0ff]">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm border-[#0ff] text-[#0ff] hover:bg-[#0ff]/10">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-[#0ff]" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommended Users Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0ff]">Meet New Learners</h2>
              <p className="opacity-70 text-white/80">
                Discover language partners based on your profile
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-[#0ff]" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-black/50 p-6 text-center rounded-xl border border-[#0ff]">
              <h3 className="font-semibold text-lg mb-2 text-[#0ff]">No recommendations available</h3>
              <p className="text-white/70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                const isOnline = user.isOnline; // assume API provides this

                return (
                  <div
                    key={user._id}
                    className="card bg-black/60 border border-[#0ff] hover:shadow-lg transition-all duration-300 rounded-xl"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`avatar size-16 rounded-full border-2 ${isOnline ? 'border-green-400' : 'border-gray-500'}`}>
                            <img src={user.profilePic} alt={user.fullName} />
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-500'} border border-black`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-[#0ff]">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1 text-white/80">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline">
                          {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70 text-white/80">{user.bio}</p>}

                      {/* Action Button */}
                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <><CheckCircleIcon className="size-4 mr-2" />Request Sent</>
                        ) : (
                          <><UserPlusIcon className="size-4 mr-2" />Send Friend Request</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
