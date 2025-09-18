declare global {
  interface SvgIconProps {
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
  }

  // 1이 아티스트
  type User = {
    id: number;
    category: number | null;
    email: string;
    name: string;
    profileImage: string;
    regDate: string;
    thumbnailImage: string;
    updDate: string;
  };

  type ReportType = {
    id: number;
    title: string;
    createdAt: string;
  };

  type ReportResult = {
    reportList: ReportType[];
    deepReportList: ReportType[];
    imageReportList: ReportType[];
  };

  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    continuous: boolean;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onerror: (event: any) => void;
    onend: () => void;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly length: number;
    isFinal: boolean;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  type ArtistType = {
    id: number;
    name: string;
    profileImage: string;
    thumbnailImage: string;
    description: string;
    followersCount: number;
    isFollowing: boolean;
    level: number;
    score: number;
    tags: string[];
    height?: number;
    weight?: number;
    birthDate?: string;
    specialty?: string[];
    // 소속유형
    affiliationType?: string;
    youtubeUrl?: string;
    instagramUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
  };

  type ProjectType = {
    id: number;
    title: string;
    thumbnailImage: string;
    description: string;
    likesCount: number;
    isLiked: boolean;
    artist: ArtistType[];
    tags: string[];
    deadline: string;
    company: string;
    caster: string;
  };
}

export type {
  SvgIconProps,
  User,
  ReportType,
  ReportResult,
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionResultList,
  SpeechRecognitionResult,
  SpeechRecognitionAlternative,
};
