"use client";

/**
 * Profile Page
 * Displays user profile data from auth_users_table
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Loader2,
  ArrowLeft,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client";
import { api } from "@/lib/api";

interface UserProfile {
  user_uuid: string;
  username: string;
  email: string;
  name: string | null;
  profile_image_url: string | null;
  subscription_status: string;
  auth_user_role: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        router.push("/");
        return;
      }

      const result = await api.getProfile(token);
      setProfile(result.profile);
      setEditName(result.profile.name || "");
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setSaving(true);
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) return;

      await api.updateProfile(token, { name: editName });
      setProfile({ ...profile, name: editName });
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSubscriptionBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      hooray: { color: "bg-green-500/10 text-green-500", label: "Active" },
      pending: { color: "bg-yellow-500/10 text-yellow-500", label: "Pending" },
      uhoh: { color: "bg-red-500/10 text-red-500", label: "Issue" },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      free: { color: "bg-gray-500/10 text-gray-500", label: "Free" },
      subscriber: { color: "bg-blue-500/10 text-blue-500", label: "Subscriber" },
      business: { color: "bg-purple-500/10 text-purple-500", label: "Business" },
    };
    const badge = badges[role] || badges.free;
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchProfile}>Try Again</Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">Profile not found</p>
        <Button onClick={() => router.push("/")}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Profile</h1>
        </div>

        <div className="grid gap-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Basic Information</CardTitle>
              {!editing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(false);
                      setEditName(profile.name || "");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar and Username */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {profile.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt={profile.username}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium">@{profile.username}</p>
                  <div className="flex gap-2 mt-1">
                    {getSubscriptionBadge(profile.subscription_status)}
                    {getRoleBadge(profile.auth_user_role)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Name */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Display Name
                </Label>
                {editing ? (
                  <Input
                    id="name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {profile.name || "Not set"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              {/* Verification Status */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Verification Status
                </Label>
                <div className="flex items-center gap-2">
                  {profile.is_verified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-yellow-500">
                        Not Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subscription */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-muted-foreground" />
                  Subscription
                </Label>
                <div className="flex items-center gap-2">
                  {getSubscriptionBadge(profile.subscription_status)}
                  <span className="text-sm text-muted-foreground capitalize">
                    {profile.subscription_status}
                  </span>
                </div>
              </div>

              {/* Role */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Account Role
                </Label>
                <div className="flex items-center gap-2">
                  {getRoleBadge(profile.auth_user_role)}
                  <span className="text-sm text-muted-foreground capitalize">
                    {profile.auth_user_role}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Dates */}
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Member Since
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(profile.created_at)}
                </p>
              </div>

              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Last Login
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(profile.last_login_at)}
                </p>
              </div>

              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Last Updated
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formatDate(profile.updated_at)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User UUID (for debugging/reference) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Developer Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">User UUID</Label>
                <code className="text-xs bg-muted p-2 rounded-md break-all">
                  {profile.user_uuid}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
