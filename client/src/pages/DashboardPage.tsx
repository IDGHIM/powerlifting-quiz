import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/context/authContext.tsx';
import './DashboardPage.css';

interface ProfileData {
  _id?: string; // MongoDB utilise _id comme string
  username?: string;
  name: string;
  weightClass: string;
  squat: string; // Cohérent avec le backend
  bench: string; // Cohérent avec le backend
  deadlift: string; // Cohérent avec le backend
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserSettings {
  theme: string;
  isPublic: boolean;
  quizProgress: number;
}

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData>({
    name: user?.username || '',
    weightClass: '',
    squat: '',
    bench: '',
    deadlift: '',
    profileImage: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Fonction pour charger le profil depuis la base de données
  const loadProfile = async () => {
    try {
      setLoading(true);
      console.log('🔍 Chargement du profil pour:', user?.username);
      
      // Utilisation du username comme identifiant unique
      const response = await fetch(`/api/profile/${user?.username}`, {
        credentials: 'include', // Important pour inclure les cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Réponse API:', response.status, response.statusText);

      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Données reçues:', profileData);
        setProfile(profileData);
      } else if (response.status === 404) {
        // Profil n'existe pas encore, on garde les valeurs par défaut
        console.log('❌ Profil non trouvé, utilisation des valeurs par défaut');
        setProfile({
          name: user?.username || '',
          weightClass: '',
          squat: '',
          bench: '',
          deadlift: '',
          profileImage: '',
        });
      } else {
        throw new Error('Erreur lors du chargement du profil');
      }
    } catch (error) {
      console.error('💥 Erreur lors du chargement du profil:', error);
      // En cas d'erreur, on réinitialise avec des valeurs vides
      setProfile({
        name: user?.username || '',
        weightClass: '',
        squat: '',
        bench: '',
        deadlift: '',
        profileImage: '',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour sauvegarder le profil en base de données
  const saveProfile = async (profileData: ProfileData) => {
    try {
      setSaveStatus('saving');
      
      const method = profileData._id ? 'PUT' : 'POST';
      const url = profileData._id ? `/api/profile/${profileData._id}` : '/api/profile';
      
      const response = await fetch(url, {
        method,
        credentials: 'include', // Important pour inclure les cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          username: user?.username, // Utilisation du username au lieu d'un userId
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde du profil');
      }

      const savedProfile = await response.json();
      setProfile(savedProfile);
      
      // Sauvegarde également en localStorage comme cache
      localStorage.setItem('profileData', JSON.stringify(savedProfile));
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      
      // En cas d'erreur, sauvegarde au moins en localStorage
      localStorage.setItem('profileData', JSON.stringify(profileData));
    }
  };

  // Fonction pour sauvegarder les paramètres utilisateur
  const saveUserSettings = async (settings: UserSettings) => {
    try {
      await fetch(`/api/user/settings/${user?.username}`, {
        method: 'PUT',
        credentials: 'include', // Utilise l'authentification par cookie
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      // Fallback vers localStorage
      localStorage.setItem('theme', settings.theme);
      localStorage.setItem('privacy', settings.isPublic ? 'public' : 'private');
      localStorage.setItem('quizProgress', settings.quizProgress.toString());
    }
  };

  // Chargement initial des données
  useEffect(() => {
    if (user?.username) {
      // Nettoyage du localStorage pour debug
      console.log('🧹 Nettoyage des anciennes données localStorage');
      localStorage.removeItem('profileData');
      
      loadProfile();
    }
  }, [user?.username]);

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

  const handleSaveProfile = async () => {
    if (isEditing) {
      await saveProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const getSaveButtonText = () => {
    switch (saveStatus) {
      case 'saving': return '💾';
      case 'saved': return '✅';
      case 'error': return '❌';
      default: return isEditing ? '✅' : '✏️';
    }
  };

  const getSaveButtonTitle = () => {
    switch (saveStatus) {
      case 'saving': return 'Sauvegarde en cours...';
      case 'saved': return 'Profil sauvegardé !';
      case 'error': return 'Erreur lors de la sauvegarde';
      default: return isEditing ? 'Sauvegarder le profil' : 'Éditer le profil';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

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
                  <input name="squat" value={profile.squat} onChange={handleProfileChange} />
                </p>
                <p>
                  <strong>Bench :</strong>{' '}
                  <input name="bench" value={profile.bench} onChange={handleProfileChange} />
                </p>
                <p>
                  <strong>Deadlift :</strong>{' '}
                  <input name="deadlift" value={profile.deadlift} onChange={handleProfileChange} />
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
                <p><strong>Squat :</strong> {profile.squat}</p>
                <p><strong>Bench :</strong> {profile.bench}</p>
                <p><strong>Deadlift :</strong> {profile.deadlift}</p>
              </>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: 'auto' }}>
            <button
              className="logout-button"
              onClick={handleSaveProfile}
              title={getSaveButtonTitle()}
              disabled={saveStatus === 'saving'}
            >
              {getSaveButtonText()}
            </button>
          </div>
        </div>
        
        {saveStatus === 'error' && (
          <div style={{ color: 'red', marginTop: '10px', fontSize: '0.9em' }}>
            Erreur lors de la sauvegarde. Les données ont été sauvegardées localement.
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;