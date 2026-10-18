import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Share2, Link2, Check, Twitter, Linkedin } from 'lucide-react';

export default function ShareButtons({ title, url }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'INKORA Article',
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Article link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`"${title}" on @INKORA — Ideas Leave a Mark.\n${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareOnLinkedIn = () => {
    const text = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Native Share button if supported */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-full border border-slate-300 dark:border-slate-800 hover:border-inkora-teal/50 hover:text-inkora-teal text-slate-500 transition-colors"
          title="Share Article"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full border border-slate-300 dark:border-slate-800 hover:border-inkora-teal/50 hover:text-inkora-teal text-slate-500 transition-colors"
        title="Copy Link"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
      </button>

      {/* Twitter/X */}
      <button
        onClick={shareOnTwitter}
        className="p-2 rounded-full border border-slate-300 dark:border-slate-800 hover:border-inkora-teal/50 hover:text-inkora-teal text-slate-500 transition-colors"
        title="Share on X / Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareOnLinkedIn}
        className="p-2 rounded-full border border-slate-300 dark:border-slate-800 hover:border-inkora-teal/50 hover:text-inkora-teal text-slate-500 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
    </div>
  );
}
