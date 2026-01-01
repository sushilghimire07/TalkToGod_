import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  Loader2Icon,
  MapPinIcon,
  ShuffleIcon,
  ShipWheelIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Onboarding failed.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success("Random Avatar Generated");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90 flex items-center justify-center p-4">
      <div className="card bg-black/60 w-full max-w-3xl shadow-2xl border-2 border-[#0ff] rounded-3xl">
        <div className="card-body p-6 sm:p-10 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] via-[#f0f] to-[#ff0]">
            🎯 Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="size-32 rounded-full bg-black/40 border-4 border-[#0ff]/30 overflow-hidden shadow-lg">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Previe...w"
                    className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-10 text-[#0ff]/50" />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleRandomAvatar}
                className="btn btn-sm btn-outline border-[#0ff] text-[#0ff] gap-2 hover:bg-[#0ff]/10"
              >
                <ShuffleIcon className="size-4" />
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
                <span className="label-text font-medium text-[#0ff]">Short Bio</span>
              </label>
              <textarea
                placeholder="Tell others about yourself...."
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered w-full h-24 bg-black/40 border-[#0ff] text-[#0ff] placeholder-[#0ff]/60 focus:border-[#f0f] focus:ring-[#f0f]"
              />
            </div>

            {/* Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <option value="">Select your native language</option>
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
                  <option value="">Select the language you’re learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-medium text-[#0ff]">Location</span>
              </label>
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#0ff]/70 pointer-events-none" />
              <input
                type="text"
                placeholder="City, Country.."
                value={formState.location}
                onChange={(e) =>
                  setFormState({ ...formState, location: e.target.value })
                }
                className="input input-bordered pl-10 w-full bg-black/40 border-[#0ff] text-[#0ff] placeholder-[#0ff]/60 focus:border-[#f0f] focus:ring-[#f0f]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-full mt-4 flex items-center justify-center bg-[#0ff] hover:bg-[#f0f] text-black font-bold"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2Icon className="animate-spin size-5 mr-2" />
                  Submitting....
                </>
              ) : (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
