import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '../hooks/useProfile';
import { useParams } from 'react-router-dom';
import { userService } from '../services/user.service';
import { IUser } from '../types/auth.types';
import ProfileHeader from '../components/ProfileHeader';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import EducationSection from '../components/EducationSection';
import SkillsSection from '../components/SkillsSection';

const ProfilePage = () => {
  const { username } = useParams();
  const { authUser, isLoading } = useAuthUser();

  const queryClient = useQueryClient();

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: () => userService.getUserProfile(username!),
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: (updatedData: Partial<IUser>) =>
      userService.updateProfile(updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });

  const handleSave = (updatedData: Partial<IUser>) => {
    updateProfile(updatedData);
  };

  if (isLoading || isUserProfileLoading) return null;

  const isOwnProfile = authUser?.username === userProfile?.username;
  const userData = isOwnProfile ? authUser : userProfile;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileHeader
        userData={userData!}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <AboutSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <ExperienceSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <EducationSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <SkillsSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProfilePage;
