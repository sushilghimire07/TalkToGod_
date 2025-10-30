import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";

const FriendsPage = () => {
  const { data: friends, isLoading, isError } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (isLoading)
    return <div className="text-center mt-10">Loading friends...</div>;
  if (isError)
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load friends.
      </div>
    );
  if (!friends || friends.length === 0)
    return <div className="text-center mt-10">No friends found.</div>;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-base-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">My Friends</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {friends.map((friend) => (
          <div
            key={friend._id}
            className="card bg-base-200 shadow-md rounded-xl p-4 flex flex-col items-center gap-3 w-full transition-transform hover:scale-105"
          >
            <div className="relative w-24 h-24">
              <img
                src={friend.profilePic || "https://via.placeholder.com/96"}
                alt={friend.fullName}
                className="w-full h-full rounded-full object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-base-100 ${
                  friend.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>

            <h2 className="font-semibold text-lg text-center">{friend.fullName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
              {friend.email}
            </p>
            {friend.location && (
              <p className="text-sm text-gray-500 dark:text-gray-300 text-center">
                {friend.location}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsPage;
