'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { InvitationPhoto } from '@/lib/invitation-config'

type ArtPhotoProps = {
  photo?: InvitationPhoto
  className?: string
  sizes: string
  priority?: boolean
  fallbackMark: string
}

/** Photograph with a quiet paper plate in place of missing or broken images. */
export function ArtPhoto({ photo, className, sizes, priority, fallbackMark }: ArtPhotoProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(photo?.src) && !failed

  return (
    <div className={cn('paper-grain relative overflow-hidden bg-paper', className)}>
      {showImage && photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center" aria-hidden="true">
          <span className="font-serif text-5xl font-light italic tracking-wide text-sage">{fallbackMark}</span>
        </div>
      )}
    </div>
  )
}
