# 📋 PLAN D'IMPLÉMENTATION - NOUVELLES FONCTIONNALITÉS

## 🎯 OBJECTIFS

1. ✅ Super Admin peut être assigné à une entreprise avec droits Admin
2. ✅ Dashboard spécifique pour Super Admin (mode entreprise)
3. ✅ Dashboard spécifique pour Caissier
4. ✅ Système de pointage pour JOURNALIER et HONORAIRE
5. ✅ Calcul automatique des salaires basé sur pointages

---

## 📊 MODIFICATIONS DU SCHÉMA DE BASE DE DONNÉES

### Nouvelles Tables

#### 1. **Attendance (Pointages)**
```prisma
model Attendance {
  id          String   @id @default(cuid())
  employeeId  String
  employee    Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  date        DateTime @default(now())
  checkIn     DateTime?
  checkOut    DateTime?
  hoursWorked Float?   @default(0)
  status      AttendanceStatus @default(PRESENT)
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("attendances")
  @@index([employeeId, date])
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  CONGE
  MALADIE
}
```

#### 2. **Modifications Employee**
```prisma
model Employee {
  // ... champs existants
  attendances  Attendance[]  // Nouvelle relation
  dailyRate    Float?        // Taux journalier (pour JOURNALIER)
  hourlyRate   Float?        // Taux horaire (pour HONORAIRE)
}
```

---

## 🔧 MODIFICATIONS BACKEND

### 1. Controllers à Créer/Modifier

#### **attendanceController.ts** (NOUVEAU)
```typescript
- createAttendance()      // Créer un pointage
- getAttendancesByEmployee()
- getAttendancesByPeriod()
- updateAttendance()
- deleteAttendance()
- checkIn()              // Pointer l'arrivée
- checkOut()             // Pointer le départ
- getAttendanceStats()   // Statistiques
```

#### **Modifications payRunController.ts**
```typescript
- generatePayslips()     // Modifier pour calculer selon pointages
  * FIXE: salaire fixe
  * JOURNALIER: jours travaillés × taux journalier
  * HONORAIRE: heures travaillées × taux horaire
```

### 2. Services à Créer/Modifier

#### **attendanceService.ts** (NOUVEAU)
```typescript
- calculateHoursWorked()
- getMonthlyAttendance()
- calculateSalaryFromAttendance()
```

#### **Modifications payRunService.ts**
```typescript
- generatePayslips() {
    // Pour chaque employé actif
    if (contractType === 'FIXE') {
      gross = rate
    } else if (contractType === 'JOURNALIER') {
      daysWorked = countWorkDays(attendances)
      gross = daysWorked × dailyRate
    } else if (contractType === 'HONORAIRE') {
      hoursWorked = sumHours(attendances)
      gross = hoursWorked × hourlyRate
    }
  }
```

### 3. Routes à Créer

#### **attendance.ts** (NOUVEAU)
```typescript
POST   /api/attendances              // Créer pointage
GET    /api/attendances              // Liste pointages
GET    /api/attendances/:id          // Détails pointage
PUT    /api/attendances/:id          // Modifier pointage
DELETE /api/attendances/:id          // Supprimer pointage
POST   /api/attendances/check-in     // Pointer arrivée
POST   /api/attendances/check-out    // Pointer départ
GET    /api/attendances/employee/:id // Pointages d'un employé
GET    /api/attendances/period       // Pointages par période
GET    /api/attendances/stats        // Statistiques
```

---

## 🎨 MODIFICATIONS FRONTEND

### 1. Nouvelles Pages

#### **Attendances.jsx** (NOUVEAU)
- Liste des pointages
- Calendrier de pointage
- Pointage rapide (check-in/check-out)
- Filtres par employé, date, statut
- Statistiques de présence

#### **SuperAdminDashboard.jsx** (NOUVEAU)
- Vue globale de toutes les entreprises
- Statistiques agrégées
- Accès rapide aux entreprises
- Gestion des droits

#### **CashierDashboard.jsx** (NOUVEAU)
- Bulletins en attente de paiement
- Paiements du jour
- Statistiques de caisse
- Actions rapides

### 2. Modifications Pages Existantes

#### **Dashboard.jsx**
```javascript
// Ajouter logique de redirection selon rôle
if (user.role === 'SUPER_ADMIN' && !user.companyId) {
  return <SuperAdminDashboard />
} else if (user.role === 'SUPER_ADMIN' && user.companyId) {
  return <AdminDashboard /> // Même vue qu'Admin
} else if (user.role === 'CAISSIER') {
  return <CashierDashboard />
} else if (user.role === 'ADMIN') {
  return <AdminDashboard />
}
```

#### **Employees.jsx**
- Ajouter champs dailyRate et hourlyRate
- Afficher selon type de contrat
- Lien vers pointages de l'employé

#### **Companies.jsx**
- Option pour assigner Super Admin à une entreprise
- Gestion des droits

### 3. Nouveaux Composants

#### **AttendanceCalendar.jsx**
- Calendrier mensuel
- Marquage des jours travaillés
- Statistiques visuelles

#### **QuickCheckIn.jsx**
- Bouton rapide de pointage
- Affichage de l'heure
- Confirmation visuelle

#### **AttendanceStats.jsx**
- Graphiques de présence
- Taux de présence
- Heures travaillées

---

## 📝 WORKFLOW DÉTAILLÉ

### 1. Pointage Journalier (JOURNALIER)

```
1. Employé arrive → Check-in (enregistre heure d'arrivée)
2. Employé part → Check-out (enregistre heure de départ)
3. Système calcule automatiquement les heures
4. À la fin du mois:
   - Admin génère cycle de paie
   - Système compte les jours travaillés
   - Calcul: jours_travaillés × taux_journalier
   - Génère bulletin avec montant calculé
```

### 2. Pointage Horaire (HONORAIRE)

```
1. Employé pointe chaque jour (check-in/check-out)
2. Système calcule heures travaillées par jour
3. À la fin du mois:
   - Admin génère cycle de paie
   - Système somme toutes les heures du mois
   - Calcul: total_heures × taux_horaire
   - Génère bulletin avec montant calculé
```

### 3. Employé Fixe (FIXE)

```
1. Pas de pointage nécessaire
2. À la fin du mois:
   - Admin génère cycle de paie
   - Salaire = taux fixe (inchangé)
   - Génère bulletin avec salaire fixe
```

---

## 🔐 GESTION DES DROITS

### Super Admin avec Entreprise

```typescript
// Quand Super Admin est assigné à une entreprise
user: {
  role: 'SUPER_ADMIN',
  companyId: 'company-123',
  permissions: ['ADMIN', 'SUPER_ADMIN']
}

// Accès:
- ✅ Toutes les fonctions Admin de son entreprise
- ✅ Peut toujours accéder à la vue globale
- ✅ Peut gérer toutes les entreprises
- ✅ Dashboard Admin quand dans son entreprise
```

### Middleware de Vérification

```typescript
// backend/src/middleware/auth.ts
export const checkCompanyAccess = (req, res, next) => {
  const { user } = req;
  const { companyId } = req.params || req.body || req.query;
  
  // Super Admin: accès à tout
  if (user.role === 'SUPER_ADMIN') {
    return next();
  }
  
  // Admin/Caissier: seulement leur entreprise
  if (user.companyId !== companyId) {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  
  next();
};
```

---

## 📊 CALCULS DE SALAIRE

### Formules

#### FIXE
```javascript
gross = employee.rate
net = gross - deductions
```

#### JOURNALIER
```javascript
daysWorked = attendances.filter(a => a.status === 'PRESENT').length
gross = daysWorked × employee.dailyRate
net = gross - deductions
```

#### HONORAIRE
```javascript
totalHours = attendances.reduce((sum, a) => sum + a.hoursWorked, 0)
gross = totalHours × employee.hourlyRate
net = gross - deductions
```

---

## 🎨 INTERFACE UTILISATEUR

### Dashboard Super Admin (Mode Global)

```
┌─────────────────────────────────────────┐
│  🏢 Vue Globale - Super Admin           │
├─────────────────────────────────────────┤
│                                         │
│  📊 Statistiques Globales               │
│  ┌─────────┬─────────┬─────────┐       │
│  │ 15      │ 234     │ 1.2M    │       │
│  │ Entrep. │ Employés│ FCFA    │       │
│  └─────────┴─────────┴─────────┘       │
│                                         │
│  🏢 Liste des Entreprises               │
│  ┌─────────────────────────────────┐   │
│  │ Tech Solutions    [Gérer] [📊] │   │
│  │ Commerce Plus     [Gérer] [📊] │   │
│  │ Services Pro      [Gérer] [📊] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ Nouvelle Entreprise]                │
└─────────────────────────────────────────┘
```

### Dashboard Caissier

```
┌─────────────────────────────────────────┐
│  💳 Dashboard Caissier                  │
├─────────────────────────────────────────┤
│                                         │
│  📊 Statistiques du Jour                │
│  ┌─────────┬─────────┬─────────┐       │
│  │ 12      │ 450K    │ 8       │       │
│  │ Paiements│ FCFA   │ En attente│     │
│  └─────────┴─────────┴─────────┘       │
│                                         │
│  ⏰ Bulletins en Attente                │
│  ┌─────────────────────────────────┐   │
│  │ Jean Dupont    150K  [💰 Payer]│   │
│  │ Marie Martin   200K  [💰 Payer]│   │
│  │ Paul Durand    180K  [💰 Payer]│   │
│  └─────────────────────────────────┘   │
│                                         │
│  📜 Paiements du Jour                   │
│  ┌─────────────────────────────────┐   │
│  │ 10:30 - Jean D.  150K ✅ [📄]  │   │
│  │ 11:15 - Marie M. 200K ✅ [📄]  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Page Pointage

```
┌─────────────────────────────────────────┐
│  ⏰ Gestion des Pointages               │
├─────────────────────────────────────────┤
│                                         │
│  🔍 Filtres                             │
│  [Employé ▼] [Date ▼] [Statut ▼]      │
│                                         │
│  📅 Calendrier - Janvier 2024           │
│  ┌─────────────────────────────────┐   │
│  │ L  M  M  J  V  S  D             │   │
│  │ 1  2  3  4  5  6  7             │   │
│  │ ✅ ✅ ✅ ✅ ✅ ⬜ ⬜            │   │
│  │ 8  9  10 11 12 13 14            │   │
│  │ ✅ ✅ ✅ ✅ ✅ ⬜ ⬜            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📊 Statistiques                        │
│  Jours travaillés: 18/22                │
│  Heures totales: 144h                   │
│  Taux présence: 82%                     │
│                                         │
│  [➕ Nouveau Pointage]                  │
└─────────────────────────────────────────┘
```

---

## 🚀 ORDRE D'IMPLÉMENTATION

### Phase 1: Base de Données (30 min)
1. ✅ Modifier schema.prisma
2. ✅ Créer migration
3. ✅ Tester migration

### Phase 2: Backend - Pointages (1h)
1. ✅ Créer attendanceService.ts
2. ✅ Créer attendanceController.ts
3. ✅ Créer routes attendance.ts
4. ✅ Modifier payRunService.ts pour calculs

### Phase 3: Backend - Droits (30 min)
1. ✅ Modifier authController.ts
2. ✅ Modifier middleware auth.ts
3. ✅ Tester permissions

### Phase 4: Frontend - Pointages (1h30)
1. ✅ Créer page Attendances.jsx
2. ✅ Créer composants pointage
3. ✅ Intégrer dans navigation

### Phase 5: Frontend - Dashboards (1h)
1. ✅ Créer SuperAdminDashboard.jsx
2. ✅ Créer CashierDashboard.jsx
3. ✅ Modifier Dashboard.jsx (routing)

### Phase 6: Tests et Ajustements (30 min)
1. ✅ Tester tous les workflows
2. ✅ Corriger bugs
3. ✅ Optimiser UX

**TEMPS TOTAL ESTIMÉ: 5 heures**

---

## ✅ CHECKLIST DE VALIDATION

### Backend
- [ ] Schéma Prisma modifié et migré
- [ ] Service de pointage fonctionnel
- [ ] Calcul de salaire selon pointages
- [ ] Routes API testées
- [ ] Permissions correctes

### Frontend
- [ ] Page pointage accessible
- [ ] Check-in/Check-out fonctionnel
- [ ] Dashboards spécifiques affichés
- [ ] Navigation adaptée aux rôles
- [ ] Calculs affichés correctement

### Fonctionnel
- [ ] JOURNALIER: salaire = jours × taux
- [ ] HONORAIRE: salaire = heures × taux
- [ ] FIXE: salaire inchangé
- [ ] Super Admin peut gérer entreprise
- [ ] Caissier voit son dashboard

---

## 📚 DOCUMENTATION À CRÉER

1. Guide utilisateur - Pointage
2. Guide admin - Calcul des salaires
3. API Documentation - Endpoints pointage
4. Guide Super Admin - Gestion multi-entreprises

---

**Prêt à commencer l'implémentation!** 🚀
