import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound.jsx";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="min-h-screen p-2 sm:p-4 bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex justify-center">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-2">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {/* Incoming Friend Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                {incomingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body p-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="avatar w-12 h-12 rounded-full bg-base-300">
                          <img src={req.sender.profilePic} alt={req.sender.fullName} />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-sm">{req.sender.fullName}</h3>
                          <div className="flex flex-wrap gap-1 text-xs mt-1">
                            <span className="badge badge-secondary badge-xs">
                              Native: {req.sender.nativeLanguage}
                            </span>
                            <span className="badge badge-outline badge-xs">
                              Learning: {req.sender.learningLanguage}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary btn-xs"
                        onClick={() => acceptRequestMutation(req._id)}
                        disabled={isPending}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Accepted Requests */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                {acceptedRequests.map((notification) => (
                  <div key={notification._id} className="card bg-base-200 shadow-sm">
                    <div className="card-body p-3 flex items-center gap-2">
                      <div className="avatar w-12 h-12 rounded-full mt-1">
                        <img
                          src={notification.recipient.profilePic}
                          alt={notification.recipient.fullName}
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                        <p className="opacity-70">
                          {notification.recipient.fullName} accepted your friend request
                        </p>
                        <p className="flex items-center text-xs opacity-50 mt-1">
                          <ClockIcon className="h-3 w-3 mr-1" /> Recently
                        </p>
                      </div>
                      <div className="badge badge-success text-xs flex items-center gap-1">
                        <MessageSquareIcon className="h-3 w-3" />
                        New Friend
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* No notifications */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
