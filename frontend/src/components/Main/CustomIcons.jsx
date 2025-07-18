import React from 'react';

export const MoodIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#FDF2F8" stroke="#F43F5E" strokeWidth="2"/>
    <circle cx="24" cy="26" r="3" fill="#F43F5E"/>
    <circle cx="40" cy="26" r="3" fill="#F43F5E"/>
    <path d="M22 40C22 40 26 46 32 46C38 46 42 40 42 40" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 20C16 20 20 16 26 18" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round"/>
    <path d="M48 20C48 20 44 16 38 18" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const HabitIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="48" height="40" rx="6" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
    <path d="M16 28L24 36L48 20" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="52" cy="16" r="6" fill="#10B981"/>
    <path d="M49 16L51 18L55 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="12" y="8" width="4" height="8" rx="2" fill="#10B981"/>
    <rect x="20" y="8" width="4" height="8" rx="2" fill="#10B981"/>
    <rect x="28" y="8" width="4" height="8" rx="2" fill="#10B981"/>
  </svg>
);

export const TherapistIcon = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head */}
    <circle cx="32" cy="20" r="12" fill="#FAF5FF" stroke="#8B5CF6" strokeWidth="2" />
    {/* Shoulders */}
    <path
      d="M16 48c0-8 16-12 16-12s16 4 16 12v4H16v-4z"
      fill="#EDE9FE"
      stroke="#8B5CF6"
      strokeWidth="2"
    />
    {/* Face details */}
    <circle cx="26" cy="18" r="2" fill="#8B5CF6" />
    <circle cx="38" cy="18" r="2" fill="#8B5CF6" />
    <path
      d="M24 26c4 4 8 4 12 0"
      stroke="#8B5CF6"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export const BreathingIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="24" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="2"/>
    <circle cx="32" cy="32" r="16" fill="#E0F2FE" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="4 4">
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 32 32"
        to="360 32 32"
        dur="4s"
        repeatCount="indefinite"/>
    </circle>
    <circle cx="32" cy="32" r="8" fill="#0EA5E9" opacity="0.3">
      <animate attributeName="r" values="8;12;8" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite"/>
    </circle>
    <path d="M32 20V44M20 32H44" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const JournalIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="8" width="40" height="48" rx="4" fill="#FAF5FF" stroke="#8B5CF6" strokeWidth="2"/>
    <rect x="8" y="12" width="4" height="40" rx="2" fill="#8B5CF6"/>
    <line x1="20" y1="20" x2="40" y2="20" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="28" x2="44" y2="28" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="36" x2="36" y2="36" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="46" cy="18" r="8" fill="#8B5CF6"/>
    <path d="M42 18L45 21L50 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WellnessIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12C32 12 20 8 16 20C12 32 32 52 32 52C32 52 52 32 48 20C44 8 32 12 32 12Z" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
    <circle cx="28" cy="24" r="2" fill="#10B981"/>
    <circle cx="36" cy="28" r="2" fill="#10B981"/>
    <circle cx="32" cy="36" r="2" fill="#10B981"/>
    <path d="M24 32C24 32 28 36 32 36C36 36 40 32 40 32" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const InsightIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="40" width="8" height="16" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
    <rect x="20" y="32" width="8" height="24" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
    <rect x="32" y="24" width="8" height="32" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
    <rect x="44" y="16" width="8" height="40" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
    <path d="M12 20L20 28L32 16L44 24" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="20" r="3" fill="#3B82F6"/>
    <circle cx="20" cy="28" r="3" fill="#3B82F6"/>
    <circle cx="32" cy="16" r="3" fill="#3B82F6"/>
    <circle cx="44" cy="24" r="3" fill="#3B82F6"/>
  </svg>
);

export const MindfulIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="28" fill="#ECFDF5" stroke="#10B981" strokeWidth="2"/>
    <path d="M32 16C32 16 24 20 24 28C24 36 32 40 32 40C32 40 40 36 40 28C40 20 32 16 32 16Z" fill="#F0FDF4" stroke="#10B981" strokeWidth="1.5"/>
    <circle cx="32" cy="28" r="4" fill="#10B981" opacity="0.6">
      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
    </circle>
    <path d="M20 48C20 48 24 44 32 44C40 44 44 48 44 48" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="26" cy="24" r="1.5" fill="#10B981"/>
    <circle cx="38" cy="24" r="1.5" fill="#10B981"/>
  </svg>
);
