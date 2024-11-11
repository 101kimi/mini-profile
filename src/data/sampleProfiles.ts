import type { UserProfile } from '../types/profile';

export const duckProfile: UserProfile = {
  userId: "duck",
  name: "Mr. Duck",
  bio: "Quack! Love swimming & bread 🦆",
  avatar: "https://images.unsplash.com/photo-1582845512747-e42001c95638?w=400",
  links: [
    {
      id: "1",
      url: "https://duck.com",
      favicon: "https://www.google.com/s2/favicons?domain=duck.com&sz=64",
      title: "DuckDuckGo"
    },
    {
      id: "2",
      url: "https://unsplash.com",
      favicon: "https://www.google.com/s2/favicons?domain=unsplash.com&sz=64",
      title: "Unsplash"
    },
    {
      id: "3",
      url: "https://github.com",
      favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
      title: "GitHub"
    }
  ],
  isEditing: false,
  email: "duck@example.com",
  bgColor: "#FDF2F8"
};

export const kamoProfile: UserProfile = {
  userId: "kamo",
  name: "Kamo Dev",
  bio: "Full-stack developer 🌟",
  avatar: "https://images.unsplash.com/photo-1579613832125-5d34a13ffe2a?w=400",
  links: [
    {
      id: "1",
      url: "https://github.com",
      favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
      title: "GitHub"
    },
    {
      id: "2",
      url: "https://twitter.com",
      favicon: "https://www.google.com/s2/favicons?domain=twitter.com&sz=64",
      title: "Twitter"
    },
    {
      id: "3",
      url: "https://dev.to",
      favicon: "https://www.google.com/s2/favicons?domain=dev.to&sz=64",
      title: "DEV Community"
    },
    {
      id: "4",
      url: "https://stackoverflow.com",
      favicon: "https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64",
      title: "Stack Overflow"
    }
  ],
  isEditing: false,
  email: "kamo@example.com",
  bgColor: "#FCE7F3"
};

export const ahiruProfile: UserProfile = {
  userId: "ahiru",
  name: "Ahiru Chan",
  bio: "Digital artist & duck enthusiast 🎨",
  avatar: "https://images.unsplash.com/photo-1465153690352-10c1b29577f8?w=400",
  links: [
    {
      id: "1",
      url: "https://dribbble.com",
      favicon: "https://www.google.com/s2/favicons?domain=dribbble.com&sz=64",
      title: "Dribbble"
    },
    {
      id: "2",
      url: "https://behance.net",
      favicon: "https://www.google.com/s2/favicons?domain=behance.net&sz=64",
      title: "Behance"
    },
    {
      id: "3",
      url: "https://instagram.com",
      favicon: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
      title: "Instagram"
    }
  ],
  isEditing: false,
  email: "ahiru@example.com",
  bgColor: "#FAE8FF"
};