import React, { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { getMyProfile, updateProfile } from "../lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CameraIcon, ShuffleIcon, Loader2Icon, ShipWheelIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: "",
    bio: "",
    profilePic: "",
    nativeLanguage: "",
    learningLanguage: "",
    location: "",
  });

  const { data: userData, isLoading: loadingProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (userData) {
      setFormState({
        fullName: userData.fullName || "",
        bio: userData.bio || "",
        profilePic: userData.profilePic || "",
        nativeLanguage: userData.nativeLanguage || "",
        learningLanguage: userData.learningLanguage || "",
        location: userData.location || "",
      });
    }
  }, [userData]);

  const { mutate: updateProfileMut, isLoading } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["myProfile"]);
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMut(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success("Random avatar generated!");
  };

  if (loadingProfile) return <div className="text-center mt-10 text-[#0ff]">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center p-2 bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90">
      <div className="card w-full max-w-xl bg-black/80 shadow-xl border border-[#0ff] rounded-xl overflow-auto">
        <div className="card-body p-4 sm:p-6 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] via-[#f0f] to-[#ff0]">
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full bg-black/40 border-2 border-[#0ff]/30 overflow-hidden shadow-md">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="w-8 h-8 text-[#0ff]/50" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-xs btn-outline border-[#0ff] text-[#0ff] gap-1 hover:bg-[#0ff]/10"
              >
                <ShuffleIcon className="w-3 h-3" />
                Random Avatar
              </button>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[#0ff]">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full bg-black/40 border-[#0ff] text-[#0ff] placeholder-[#0ff]/60 focus:border-[#f0f] focus:ring-[#f0f]"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[#0ff]">Bio</span>
              </label>
              <textarea
                placeholder="Tell others about yourself..."
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered w-full h-20 bg-black/40 border-[#0ff] text-[#0ff] placeholder-[#0ff]/60 focus:border-[#f0f] focus:ring-[#f0f]"
              />
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-[#0ff]">Native Language</span>
                </label>
                <select
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({ ...formState, nativeLanguage: e.target.value })
                  }
                  className="select select-bordered w-full bg-black/40 border-[#0ff] text-[#0ff] focus:border-[#f0f] focus:ring-[#f0f]"
                >
                  <option value="">Select native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-[#0ff]">Learning Language</span>
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({ ...formState, learningLanguage: e.target.value })
                  }
                  className="select select-bordered w-full bg-black/40 border-[#0ff] text-[#0ff] focus:border-[#f0f] focus:ring-[#f0f]"
                >
                  <option value="">Select learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-[#0ff]">Location</span>
              </label>
              <input
                type="text"
                value={formState.location}
                onChange={(e) =>
                  setFormState({ ...formState, location: e.target.value })
                }
                placeholder="City, Country"
                className="input input-bordered w-full bg-black/40 border-[#0ff] text-[#0ff] placeholder-[#0ff]/60 focus:border-[#f0f] focus:ring-[#f0f]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn w-full mt-2 flex items-center justify-center gap-2 bg-[#0ff] hover:bg-[#f0f] text-black font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="animate-spin w-5 h-5" />
                  Saving...
                </>
              ) : (
                <>
                  <ShipWheelIcon className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
