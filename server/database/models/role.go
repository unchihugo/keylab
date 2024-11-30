package models

type Role struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

type Permission struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

type RolePermission struct {
    RoleID       int `json:"role_id"`
    PermissionID int `json:"permission_id"`
}
