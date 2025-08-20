"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { User, Lock, Trash2, LogOut, Edit, Check, X } from "lucide-react"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, logout } = useAuth()
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(user?.name || "")
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false)
  
  // Password change form
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleEditName = () => {
    setIsEditingName(true)
    setNameValue(user?.name || "")
  }

  const handleCancelEdit = () => {
    setIsEditingName(false)
    setNameValue(user?.name || "")
  }

  const handleSaveName = async () => {
    if (!nameValue.trim()) {
      toast.error("Nazwa nie może być pusta")
      return
    }

    try {
      setIsUpdatingName(true)
      await apiClient.updateUserProfile({ name: nameValue.trim() })
      
      // Update local user data
      const storedSession = localStorage.getItem("bandspace_session")
      if (storedSession) {
        const session = JSON.parse(storedSession)
        session.user.name = nameValue.trim()
        localStorage.setItem("bandspace_session", JSON.stringify(session))
        
        // Dispatch event to notify auth context
        window.dispatchEvent(
          new CustomEvent("bandspace-session-updated", { 
            detail: session 
          })
        )
      }
      
      setIsEditingName(false)
      toast.success("Nazwa została zaktualizowana")
    } catch (error) {
      console.error("Failed to update name:", error)
      toast.error("Nie udało się zaktualizować nazwy")
    } finally {
      setIsUpdatingName(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Wszystkie pola są wymagane")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Nowe hasła nie są zgodne")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Nowe hasło musi mieć co najmniej 6 znaków")
      return
    }

    try {
      setIsChangingPassword(true)
      await apiClient.changePassword(currentPassword, newPassword)
      
      setShowChangePasswordDialog(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      toast.success("Hasło zostało zmienione")
    } catch (error) {
      console.error("Failed to change password:", error)
      toast.error("Nie udało się zmienić hasła")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true)
      await apiClient.deleteAccount()
      
      // Log out user after account deletion
      await logout()
      
      setShowDeleteDialog(false)
      onOpenChange(false)
      
      toast.success("Konto zostało usunięte")
    } catch (error) {
      console.error("Failed to delete account:", error)
      toast.error("Nie udało się usunąć konta")
    } finally {
      setIsDeletingAccount(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      onOpenChange(false)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil publiczny
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nazwa</Label>
                  <div className="flex gap-2">
                    <Input
                      id="name"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      readOnly={!isEditingName}
                      placeholder="Uzupełnij swoją nazwę"
                      className={!isEditingName ? "bg-muted" : ""}
                    />
                    <div className="flex gap-1">
                      {isEditingName ? (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleSaveName}
                            disabled={isUpdatingName}
                          >
                            {isUpdatingName ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={isUpdatingName}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleEditName}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Email Field (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Bezpieczeństwo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowChangePasswordDialog(true)}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Zmień hasło
                </Button>
              </CardContent>
            </Card>

            <Separator />

            {/* Danger Zone */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Strefa zagrożenia
                </CardTitle>
                <CardDescription>
                  Te operacje są nieodwracalne
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeletingAccount}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Usuń konto
                </Button>
              </CardContent>
            </Card>

            <Separator />

            {/* Logout Button */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Wyloguj się
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showChangePasswordDialog} onOpenChange={setShowChangePasswordDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Zmień hasło</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Obecne hasło</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nowe hasło</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Potwierdź nowe hasło</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowChangePasswordDialog(false)}
              >
                Anuluj
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                Zmień hasło
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Usuń konto</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna 
              i spowoduje trwałe usunięcie wszystkich twoich danych.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingAccount ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : null}
              Usuń konto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}