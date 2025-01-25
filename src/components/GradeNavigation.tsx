import { Apple, Book, Calculator, Shapes, Rocket } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const gradeIcons = {
  "K1": Apple,
  "G2": Book,
  "G3": Calculator,
  "G4": Shapes,
  "G5": Rocket,
} as const;

const grades = ["K1", "G2", "G3", "G4", "G5"] as const;

export function GradeNavigation() {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {profile.role === "student" ? "Grade Selection" : "Class Management"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profile.role === "student" ? (
                grades.map((grade) => {
                  const Icon = gradeIcons[grade];
                  const isCurrentGrade = profile.grade === grade;
                  
                  return (
                    <SidebarMenuItem key={grade}>
                      <SidebarMenuButton
                        tooltip={`${grade} Grade`}
                        isActive={isCurrentGrade}
                      >
                        <Icon />
                        <span>{grade}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Manage Classes">
                    <Shapes />
                    <span>Class Management</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}