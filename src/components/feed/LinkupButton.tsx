import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, Users } from 'lucide-react';
import { useLinkup } from '@/hooks/useLinkup';
import { useAuth } from '@/hooks/useAuth';

interface LinkupButtonProps {
  userId: string;
  className?: string;
}

export const LinkupButton: React.FC<LinkupButtonProps> = ({ userId, className = '' }) => {
  const { status, linkup, unlinkup } = useLinkup(userId);
  const { loggedInUser } = useAuth();
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await loggedInUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Don't show button for own profile
  if (currentUser && currentUser.user_id === userId) {
    return null;
  }

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (status.isLinkedUp) {
      await unlinkup();
    } else {
      await linkup();
    }
  };

  const getButtonContent = () => {
    if (status.isLoading) {
      return {
        text: 'Loading...',
        icon: <Plus className="h-4 w-4" />,
        variant: 'outline' as const
      };
    }

    if (status.isMutual) {
      return {
        text: 'Unlink',
        icon: <Users className="h-4 w-4" />,
        variant: 'secondary' as const
      };
    }

    if (status.isLinkedUp) {
      return {
        text: 'Linked',
        icon: <Check className="h-4 w-4" />,
        variant: 'outline' as const
      };
    }

    return {
      text: 'Linkup',
      icon: <Plus className="h-4 w-4" />,
      variant: 'default' as const
    };
  };

  const { text, icon, variant } = getButtonContent();

  return (
    <Button
      onClick={handleClick}
      disabled={status.isLoading}
      variant={variant}
      size="sm"
      className={`flex items-center gap-1 ${variant === 'default' ? 'bg-primary text-white hover:bg-primary/90' : ''} ${className}`}
    >
      {icon}
      <span className="text-xs">{text}</span>
    </Button>
  );
};