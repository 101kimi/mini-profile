import React, { useState, useEffect } from 'react';
import { ProfileWidget } from './ProfileWidget';

interface ProfileCarouselProps {
  userIds: string[];
  className?: string;
}

export function ProfileCarousel({ userIds, className = "" }: ProfileCarouselProps) {
  const containerWidth = 800;
  const itemWidth = 320;
  const spacing = 40;
  const totalItemWidth = itemWidth + spacing;
  
  const [items] = useState([...userIds, ...userIds, ...userIds]);
  
  const [positions, setPositions] = useState(() => {
    const centerX = (containerWidth - itemWidth) / 2;
    return items.map((_, i) => {
      const offset = i * totalItemWidth;
      return centerX + offset;
    });
  });

  useEffect(() => {
    const speed = 1;
    let animationFrameId: number;

    const animate = () => {
      setPositions(prevPositions => {
        return prevPositions.map(pos => {
          const newPos = pos - speed;
          
          if (newPos < -itemWidth) {
            return Math.max(...prevPositions) + totalItemWidth;
          }
          
          return newPos;
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className={`relative max-w-[800px] mx-auto ${className}`}>
      <div className="overflow-hidden relative">
        {/* Left gradient fade */}
        <div className="absolute left-0 top-0 bottom-0 md:w-32 w-16 bg-gradient-to-r from-pink-50 via-rose-50/80 to-transparent z-[1]" />
        
        {/* Right gradient fade */}
        <div className="absolute right-0 top-0 bottom-0 md:w-32 w-16 bg-gradient-to-l from-pink-50 via-rose-50/80 to-transparent z-[1]" />
        
        <div className="relative h-[400px]">
          {items.map((userId, index) => (
            <div
              key={`${userId}-${index}`}
              className="absolute top-0 will-change-transform"
              style={{ 
                transform: `translateX(${positions[index]}px)`,
              }}
            >
              <ProfileWidget userId={userId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}