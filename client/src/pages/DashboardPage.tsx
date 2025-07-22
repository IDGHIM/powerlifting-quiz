import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/context/authContext.tsx';
import './DashboardPage.css';

const PROFILE_KEY = 'profileData';

interface ProfileData {
  name: string;
  weightClass: string;
  Squat: string;
  Bench: string;
  Deadlift: string;
  profileImage?: string;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData>({
    name: user?.username || '',
    weightClass: '',
    Squat: '',
    Bench: '',
    Deadlift: '',
    profileImage: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [theme, setTheme] = useState<'clair' | 'sombre'>('clair');
  const [isPublic, setIsPublic] = useState(true);
  const [quizProgress, setQuizProgress] = useState(0);

  useEffect(() => {
    const storedProfile = localStorage.getItem(PROFILE_KEY);
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'sombre' || storedTheme === 'clair') {
      setTheme(storedTheme);
    }

    const storedPrivacy = localStorage.getItem('privacy');
    if (storedPrivacy === 'private') {
      setIsPublic(false);
    }

    const storedProgress = localStorage.getItem('quizProgress');
    if (storedProgress) {
      setQuizProgress(parseInt(storedProgress, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    localStorage.setItem('privacy', isPublic ? 'public' : 'private');
    localStorage.setItem('quizProgress', quizProgress.toString());
  }, [profile, theme, isPublic, quizProgress]);

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
      navigate('/login');
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Résumé Profil */}
      <section className="profile-section">
        <h2>Profil</h2>
        <div className="profile-card">
          <img
            src={
              profile.profileImage
                ? profile.profileImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`
            }
            alt="Avatar"
            className="profile-avatar"
          />
          <div className="profile-info">
            {isEditing ? (
              <>
                <p>
                  <strong>Nom :</strong>{' '}
                  <input name="name" value={profile.name} onChange={handleProfileChange} />
                </p>
                <p>
                  <strong>Catégorie :</strong>{' '}
                  <input name="weightClass" value={profile.weightClass} onChange={handleProfileChange} />
                </p>
                <p>
                  <strong>Squat :</strong>{' '}
                  <input name="Squat" value={profile.Squat} onChange={handleProfileChange} />
                </p>
                <p>
                  <strong>Bench :</strong>{' '}
                  <input name="Bench" value={profile.Bench} onChange={handleProfileChange} />
                </p>
                <p>
                  <strong>Deadlift :</strong>{' '}
                  <input name="Deadlift" value={profile.Deadlift} onChange={handleProfileChange} />
                </p>
                <p>
                  <strong>Photo :</strong>{' '}
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </p>
              </>
            ) : (
              <>
                <p><strong>Nom :</strong> {profile.name}</p>
                <p><strong>Catégorie :</strong> {profile.weightClass}</p>
                <p><strong>Squat :</strong> {profile.Squat}</p>
                <p><strong>Bench :</strong> {profile.Bench}</p>
                <p><strong>Deadlift :</strong> {profile.Deadlift}</p>
              </>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: 'auto' }}>
            <button
              className="logout-button"
              onClick={() => setIsEditing(!isEditing)}
              title="Éditer le profil"
            >
              {isEditing ? '✅' : '✏️'}
            </button>
            <button
              className="logout-button"
              onClick={handleLogout}
              title="Déconnexion"
            >
              ⏻
            </button>
          </div>
        </div>
      </section>

      {/* Progression Quiz */}
      <section className="quiz-section">
        <h2>Progression Quiz</h2>
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${quizProgress}%` }} />
          </div>
          <p>{quizProgress}% de questions répondues</p>
        </div>
      </section>

      {/* Paramètres */}
      <section className="settings-section">
        <h2>Paramètres</h2>
        <div className="settings-options">
          <div>
            <label>Thème :</label>{' '}
            <select value={theme} onChange={(e) => setTheme(e.target.value as 'clair' | 'sombre')}>
              <option value="clair">Clair</option>
              <option value="sombre">Sombre</option>
            </select>
          </div>
          <div>
            <label>Confidentialité :</label>{' '}
            <select
              value={isPublic ? 'public' : 'privé'}
              onChange={(e) => setIsPublic(e.target.value === 'public')}
            >
              <option value="public">Public</option>
              <option value="privé">Privé</option>
            </select>
          </div>
          <div>
            <label>Modifier progression quiz :</label>{' '}
            <input
              type="number"
              min={0}
              max={100}
              value={quizProgress}
              onChange={(e) => setQuizProgress(Math.max(0, Math.min(100, Number(e.target.value))))}
            /> %
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
