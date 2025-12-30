-- ============================
-- AlgoMaster Database Population Script
-- ============================
-- Password hash for "password123": $2b$10$MzcDDbtuLYqUel1Jav0ofuYFctKpJSBuEbjj/JkxnyycPBip4CMY.
-- (This is a bcrypt hash - adjust based on your hashing algorithm)

-- ============================
-- POPULATE USERS
-- ============================

-- Teachers
INSERT INTO "USER" ("Nom", "Prenom", "DateNaissance", "Email", "motDePasse") VALUES
('Benali', 'Mehdi', '1985-03-15', 'mehdi@algomaster.com', '$2b$10$MzcDDbtuLYqUel1Jav0ofuYFctKpJSBuEbjj/JkxnyycPBip4CMY.'),
('Khelifi', 'Akram', '1988-07-22', 'akram@algomaster.com', '$2b$10$MzcDDbtuLYqUel1Jav0ofuYFctKpJSBuEbjj/JkxnyycPBip4CMY.'),
('Meziane', 'Ayoub', '1990-11-08', 'ayoub@algomaster.com', '$2b$10$MzcDDbtuLYqUel1Jav0ofuYFctKpJSBuEbjj/JkxnyycPBip4CMY.'),
-- Students
('Bouazza', 'Benzo', '2002-05-12', 'benzo@student.com', '$2b$10$MzcDDbtuLYqUel1Jav0ofuYFctKpJSBuEbjj/JkxnyycPBip4CMY.'),
('Cherif', 'Lamass', '2003-09-18', 'lamass@student.com', '$2b$10$MzcDDbtuLYqUel1Jav0ofuYFctKpJSBuEbjj/JkxnyycPBip4CMY.'),
('Hamidi', 'Islem', '2002-12-03', 'islem@student.com', '$2b$10$MzcDDbtuLYqUel1Jav0ofuYFctKpJSBuEbjj/JkxnyycPBip4CMY.');

-- ============================
-- POPULATE ENSEIGNANT (Teachers)
-- ============================
INSERT INTO "ENSEIGNANT" ("idUser", "Specialite", "Grade") VALUES
(1, 'Algorithmique et Structures de Données', 'Professeur'),
(2, 'Complexité et Optimisation', 'Maître de Conférences'),
(3, 'Programmation et Théorie des Graphes', 'Maître Assistant');

-- ============================
-- POPULATE ETUDIANT (Students)
-- ============================
INSERT INTO "ETUDIANT" ("idUser", "Specialite", "Annee", "level", "xp") VALUES
(4, 'Informatique', 2, 3, 450),
(5, 'Génie Logiciel', 1, 2, 180),
(6, 'Informatique', 2, 4, 720);

-- ============================
-- POPULATE COURS (Courses)
-- ============================
INSERT INTO "COURS" ("idCours", "titre", "niveau", "description", "duree", "idEnseignant") VALUES
(1, 'Introduction aux Algorithmes', 'Algo1', 'Découvrez les fondamentaux de l''algorithmique : complexité, structures de données de base et algorithmes de tri.', '8 semaines', 1),
(2, 'Structures de Données Avancées', 'Algo1', 'Approfondissez vos connaissances avec les arbres, graphes, tables de hachage et files de priorité.', '10 semaines', 2),
(3, 'Algorithmes de Graphes', 'Algo2', 'Maîtrisez les algorithmes essentiels sur les graphes : parcours, plus courts chemins et arbres couvrants.', '12 semaines', 3),
(4, 'Programmation Dynamique', 'Algo2', 'Résolvez des problèmes complexes avec la programmation dynamique et les techniques de mémoïsation.', '10 semaines', 1),
(5, 'Algorithmes de Tri et Recherche', 'Algo1', 'Explorez en détail les algorithmes de tri et de recherche, leur complexité et leurs optimisations.', '6 semaines', 2);

-- ============================
-- POPULATE TOPICS
-- ============================
INSERT INTO "TOPIC" ("nom", "idCours") VALUES
-- Course 1: Introduction aux Algorithmes
('Complexité algorithmique', 1),
('Tableaux et listes', 1),
('Algorithmes de tri simples', 1),
('Récursivité', 1),
-- Course 2: Structures de Données Avancées
('Arbres binaires', 2),
('Arbres AVL et Red-Black', 2),
('Tables de hachage', 2),
('Graphes', 2),
-- Course 3: Algorithmes de Graphes
('Parcours en largeur (BFS)', 3),
('Parcours en profondeur (DFS)', 3),
('Algorithme de Dijkstra', 3),
('Algorithme de Bellman-Ford', 3),
('Arbres couvrants minimaux', 3),
-- Course 4: Programmation Dynamique
('Introduction à la PD', 4),
('Mémoïsation', 4),
('Problème du sac à dos', 4),
('Plus longue sous-séquence commune', 4),
-- Course 5: Algorithmes de Tri et Recherche
('Tri par insertion', 5),
('Tri fusion', 5),
('Tri rapide', 5),
('Recherche binaire', 5);

-- ============================
-- POPULATE COURS_SECTION
-- ============================
INSERT INTO "COURS_SECTION" ("section", "theorie", "codeExample", "idCours") VALUES
-- Course 1: Introduction aux Algorithmes
('Introduction à la Complexité', 'La complexité algorithmique mesure l''efficacité d''un algorithme en termes de temps et d''espace. On utilise la notation Big O pour exprimer la complexité dans le pire cas.', 
'# Exemple: Complexité O(n)
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1', 1),

('Notation Big O', 'Big O décrit la limite supérieure de la complexité. O(1) est constant, O(log n) logarithmique, O(n) linéaire, O(n log n) quasi-linéaire, O(n²) quadratique.', 
'# O(1) - Constant
def get_first(arr):
    return arr[0]

# O(n²) - Quadratique
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]', 1),

('Tri par Sélection', 'Le tri par sélection trouve le minimum et le place au début. Complexité: O(n²) dans tous les cas.', 
'def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr', 1),

('Récursivité Basique', 'La récursivité est une technique où une fonction s''appelle elle-même. Elle nécessite un cas de base pour arrêter la récursion.', 
'def factorial(n):
    # Cas de base
    if n == 0 or n == 1:
        return 1
    # Appel récursif
    return n * factorial(n - 1)

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)', 1),

-- Course 2: Structures de Données Avancées
('Arbres Binaires de Recherche', 'Un arbre binaire de recherche (ABR) est un arbre où chaque nœud a au plus deux enfants, et la valeur du fils gauche est inférieure au parent, celle du fils droit supérieure.', 
'class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None

class BST:
    def insert(self, root, data):
        if root is None:
            return Node(data)
        if data < root.data:
            root.left = self.insert(root.left, data)
        else:
            root.right = self.insert(root.right, data)
        return root', 2),

('Tables de Hachage', 'Les tables de hachage offrent un accès en O(1) moyen grâce à une fonction de hachage qui mappe les clés vers des indices.', 
'class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def hash_function(self, key):
        return hash(key) % self.size
    
    def insert(self, key, value):
        hash_index = self.hash_function(key)
        self.table[hash_index].append((key, value))
    
    def search(self, key):
        hash_index = self.hash_function(key)
        for k, v in self.table[hash_index]:
            if k == key:
                return v
        return None', 2),

-- Course 3: Algorithmes de Graphes
('Parcours BFS', 'Le parcours en largeur (BFS) explore un graphe niveau par niveau à l''aide d''une file. Complexité: O(V + E).', 
'from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result', 3),

('Algorithme de Dijkstra', 'L''algorithme de Dijkstra trouve le plus court chemin depuis une source vers tous les autres sommets dans un graphe pondéré positivement.', 
'import heapq

def dijkstra(graph, start):
    distances = {node: float("inf") for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_dist, current = heapq.heappop(pq)
        
        if current_dist > distances[current]:
            continue
            
        for neighbor, weight in graph[current]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    
    return distances', 3),

-- Course 4: Programmation Dynamique
('Introduction à la Programmation Dynamique', 'La programmation dynamique résout des problèmes en les décomposant en sous-problèmes plus simples et en mémorisant leurs solutions.', 
'# Fibonacci avec mémoïsation
def fib_dp(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_dp(n-1, memo) + fib_dp(n-2, memo)
    return memo[n]

# Approche tabulaire
def fib_tabular(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]', 4),

('Problème du Sac à Dos', 'Le problème du sac à dos consiste à maximiser la valeur des objets placés dans un sac de capacité limitée.', 
'def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(
                    values[i-1] + dp[i-1][w - weights[i-1]],
                    dp[i-1][w]
                )
            else:
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]', 4),

-- Course 5: Algorithmes de Tri et Recherche
('Tri Fusion (Merge Sort)', 'Le tri fusion utilise la stratégie diviser pour régner. Complexité: O(n log n) dans tous les cas.', 
'def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result', 5),

('Recherche Binaire', 'La recherche binaire trouve un élément dans un tableau trié en O(log n) en divisant l''espace de recherche par deux à chaque étape.', 
'def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1', 5);

-- ============================
-- POPULATE EXERCISES
-- ============================

-- Course 1 Exercises (Introduction aux Algorithmes)
INSERT INTO "EXERCISE" ("title", "type", "statement", "idEnseignant", "idCours") VALUES
('Complexité d''un algorithme simple', 'qcm', 'Quelle est la complexité temporelle de l''algorithme suivant?

```python
def mystery(n):
    for i in range(n):
        for j in range(n):
            print(i, j)
```', 1, 1),

('Notation Big O', 'quiz', 'Expliquez en une phrase ce que signifie la notation O(n log n).', 1, 1),

('Implémentation de la recherche linéaire', 'code', 'Implémentez une fonction de recherche linéaire qui prend un tableau et une valeur cible, et retourne l''index de la valeur si elle existe, sinon -1.

Signature: def linear_search(arr, target)', 1, 1),

('Tri par sélection', 'code', 'Implémentez l''algorithme de tri par sélection.

Signature: def selection_sort(arr)', 1, 1),

('Complexité du tri à bulles', 'qcm', 'Quelle est la complexité dans le meilleur cas du tri à bulles optimisé (avec un flag d''arrêt anticipé)?', 1, 1),

-- Course 2 Exercises (Structures de Données Avancées)
('Insertion dans un ABR', 'code', 'Implémentez une fonction pour insérer un nœud dans un arbre binaire de recherche.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
```

Signature: def insert(root, data)', 2, 2),

('Table de hachage', 'quiz', 'Qu''est-ce qu''une collision dans une table de hachage et comment peut-on la résoudre?', 2, 2),

('Propriétés des ABR', 'qcm', 'Dans un arbre binaire de recherche, quelle propriété est toujours vraie?', 2, 2),

-- Course 3 Exercises (Algorithmes de Graphes)
('Implémentation BFS', 'code', 'Implémentez l''algorithme de parcours en largeur (BFS) pour un graphe représenté par une liste d''adjacence.

Signature: def bfs(graph, start)', 3, 3),

('Plus court chemin', 'quiz', 'Quelle est la différence principale entre l''algorithme de Dijkstra et l''algorithme de Bellman-Ford?', 3, 3),

('Complexité de BFS', 'qcm', 'Quelle est la complexité temporelle du parcours BFS sur un graphe?', 3, 3),

-- Course 4 Exercises (Programmation Dynamique)
('Fibonacci avec mémoïsation', 'code', 'Implémentez la suite de Fibonacci en utilisant la mémoïsation (programmation dynamique top-down).

Signature: def fibonacci_memo(n, memo={})', 1, 4),

('Principe de la PD', 'quiz', 'Expliquez le principe de la sous-structure optimale en programmation dynamique.', 1, 4),

('Sac à dos', 'code', 'Implémentez le problème du sac à dos 0/1 en utilisant la programmation dynamique.

Entrée: weights (liste des poids), values (liste des valeurs), capacity (capacité du sac)
Signature: def knapsack(weights, values, capacity)', 1, 4),

-- Course 5 Exercises (Tri et Recherche)
('Tri fusion', 'code', 'Implémentez l''algorithme de tri fusion (merge sort).

Signature: def merge_sort(arr)', 2, 5),

('Recherche binaire', 'code', 'Implémentez la recherche binaire pour trouver un élément dans un tableau trié.

Signature: def binary_search(arr, target)', 2, 5),

('Stabilité du tri', 'qcm', 'Parmi les algorithmes suivants, lesquels sont stables?', 2, 5);

-- ============================
-- POPULATE QCM OPTIONS & ANSWERS
-- ============================

-- Exercise 1: Complexité d'un algorithme simple
INSERT INTO "QCM_OPTION" ("exerciseId", "optionText") VALUES
(1, 'O(n)'),
(1, 'O(n²)'),
(1, 'O(n log n)'),
(1, 'O(log n)');

INSERT INTO "QCM_ANSWER" ("exerciseId", "correctOptionIndex") VALUES (1, 1); -- O(n²) is correct

-- Exercise 5: Complexité du tri à bulles
INSERT INTO "QCM_OPTION" ("exerciseId", "optionText") VALUES
(5, 'O(n²)'),
(5, 'O(n)'),
(5, 'O(n log n)'),
(5, 'O(1)');

INSERT INTO "QCM_ANSWER" ("exerciseId", "correctOptionIndex") VALUES (5, 1); -- O(n) is correct

-- Exercise 8: Propriétés des ABR
INSERT INTO "QCM_OPTION" ("exerciseId", "optionText") VALUES
(8, 'Tous les nœuds du sous-arbre gauche sont plus petits que la racine'),
(8, 'L''arbre est toujours équilibré'),
(8, 'Tous les nœuds ont exactement deux enfants'),
(8, 'La hauteur est toujours log(n)');

INSERT INTO "QCM_ANSWER" ("exerciseId", "correctOptionIndex") VALUES (8, 0);

-- Exercise 11: Complexité de BFS
INSERT INTO "QCM_OPTION" ("exerciseId", "optionText") VALUES
(11, 'O(V)'),
(11, 'O(E)'),
(11, 'O(V + E)'),
(11, 'O(V * E)');

INSERT INTO "QCM_ANSWER" ("exerciseId", "correctOptionIndex") VALUES (11, 2); -- O(V + E)

-- Exercise 16: Stabilité du tri
INSERT INTO "QCM_OPTION" ("exerciseId", "optionText") VALUES
(16, 'Tri fusion et tri par insertion'),
(16, 'Tri rapide et tri par sélection'),
(16, 'Tri par sélection uniquement'),
(16, 'Aucun algorithme de tri n''est stable');

INSERT INTO "QCM_ANSWER" ("exerciseId", "correctOptionIndex") VALUES (16, 0);

-- ============================
-- POPULATE QUIZ ANSWERS
-- ============================
INSERT INTO "QUIZ_ANSWER" ("exerciseId", "answer") VALUES
(2, 'O(n log n) signifie que le temps d''exécution croît proportionnellement à n multiplié par le logarithme de n, typique des algorithmes de tri efficaces comme le tri fusion.'),
(7, 'Une collision se produit quand deux clés différentes produisent le même hash. On peut la résoudre par chaînage (listes chaînées) ou adressage ouvert (probing).'),
(10, 'Dijkstra fonctionne uniquement avec des poids positifs et est généralement plus rapide, tandis que Bellman-Ford peut gérer des poids négatifs mais est plus lent (O(VE) vs O(V log V + E)).'),
(13, 'Un problème possède une sous-structure optimale si sa solution optimale peut être construite à partir des solutions optimales de ses sous-problèmes.');

-- ============================
-- POPULATE CODE TESTS
-- ============================

-- Exercise 3: Recherche linéaire
INSERT INTO "CODE_TEST" ("exerciseId", "input", "expectedOutput") VALUES
(3, '[1, 2, 3, 4, 5]
3', '2'),
(3, '[10, 20, 30, 40]
50', '-1'),
(3, '[5]
5', '0');

-- Exercise 4: Tri par sélection
INSERT INTO "CODE_TEST" ("exerciseId", "input", "expectedOutput") VALUES
(4, '[64, 25, 12, 22, 11]', '[11, 12, 22, 25, 64]'),
(4, '[5, 2, 8, 1, 9]', '[1, 2, 5, 8, 9]'),
(4, '[1]', '[1]');

-- Exercise 6: Insertion dans ABR
INSERT INTO "CODE_TEST" ("exerciseId", "input", "expectedOutput") VALUES
(6, 'None
5', '5'),
(6, '5
3', '5 3'),
(6, '5 3 7
4', '5 3 4 7');

-- Exercise 9: BFS
INSERT INTO "CODE_TEST" ("exerciseId", "input", "expectedOutput") VALUES
(9, '{"A": ["B", "C"], "B": ["D"], "C": ["E"], "D": [], "E": []}
A', '["A", "B", "C", "D", "E"]'),
(9, '{"1": ["2", "3"], "2": ["4"], "3": [], "4": []}
1', '["1", "2", "3", "4"]');

-- Exercise 12: Fibonacci mémoïsation
INSERT INTO "CODE_TEST" ("exerciseId", "input", "expectedOutput") VALUES
(12, '5', '5'),
(12, '10', '55'),
(12, '0', '0');

-- Exercise 14: Sac à dos
INSERT INTO "CODE_TEST" ("exerciseId", "input", "expectedOutput") VALUES
(14, '[1, 2, 3]
[10, 15, 40]
6', '55'),
(14, '[2, 3, 4]
[3, 4, 5]
5', '7');

-- Exercise 15: Tri fusion
INSERT INTO "CODE_TEST" ("exerciseId", "input", "expectedOutput") VALUES
(15, '[38, 27, 43, 3, 9, 82, 10]', '[3, 9, 10, 27, 38, 43, 82]'),
(15, '[5, 2, 8, 1, 9]', '[1, 2, 5, 8, 9]');

-- Exercise 16: Recherche binaire
INSERT INTO "CODE_TEST" ("exerciseId", "input", "expectedOutput") VALUES
(16, '[1, 2, 3, 4, 5, 6, 7, 8, 9]
5', '4'),
(16, '[1, 3, 5, 7, 9]
6', '-1');

-- ============================
-- POPULATE STUDENT ENROLLMENTS
-- ============================
INSERT INTO "ETUDIANT_COURS" ("idUser", "idCours", "tempsDebut", "tempsFin", "tempsConcentration", "completed", "progress", "enrolledAt", "completedAt") VALUES
-- Benzo enrollments
(4, 1, 0, 120, 95, TRUE, 100, NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days'),
(4, 2, 0, 90, 85, FALSE, 60, NOW() - INTERVAL '30 days', NULL),
(4, 3, 0, 45, 90, FALSE, 30, NOW() - INTERVAL '15 days', NULL),

-- Lamass enrollments
(5, 1, 0, 60, 75, FALSE, 45, NOW() - INTERVAL '20 days', NULL),
(5, 5, 0, 80, 88, FALSE, 65, NOW() - INTERVAL '25 days', NULL),

-- Islem enrollments
(6, 1, 0, 150, 92, TRUE, 100, NOW() - INTERVAL '90 days', NOW() - INTERVAL '60 days'),
(6, 2, 0, 130, 88, TRUE, 100, NOW() - INTERVAL '60 days', NOW() - INTERVAL '20 days'),
(6, 3, 0, 80, 90, FALSE, 55, NOW() - INTERVAL '20 days', NULL),
(6, 4, 0, 60, 85, FALSE, 40, NOW() - INTERVAL '10 days', NULL);

-- ============================
-- POPULATE EXERCISE COMPLETIONS
-- ============================
INSERT INTO "ETUDIANT_EXERCICE" ("idUser", "idExercice", "completed", "score", "completedAt") VALUES
-- Benzo (student 4) - completed exercises from course 1
(4, 1, TRUE, 100, NOW() - INTERVAL '28 days'),
(4, 2, TRUE, 85, NOW() - INTERVAL '27 days'),
(4, 3, TRUE, 90, NOW() - INTERVAL '26 days'),
(4, 4, TRUE, 95, NOW() - INTERVAL '25 days'),
(4, 5, TRUE, 100, NOW() - INTERVAL '24 days'),
-- Some from course 2
(4, 6, TRUE, 80, NOW() - INTERVAL '20 days'),
(4, 7, TRUE, 75, NOW() - INTERVAL '18 days'),
(4, 8, FALSE, 0, NULL),

-- Lamass (student 5) - partial progress
(5, 1, TRUE, 70, NOW() - INTERVAL '18 days'),
(5, 2, TRUE, 65, NOW() - INTERVAL '17 days'),
(5, 3, FALSE, 0, NULL),
(5, 15, TRUE, 88, NOW() - INTERVAL '15 days'),
(5, 16, TRUE, 92, NOW() - INTERVAL '14 days'),

-- Islem (student 6) - most advanced, completed many exercises
(6, 1, TRUE, 100, NOW() - INTERVAL '58 days'),
(6, 2, TRUE, 95, NOW() - INTERVAL '57 days'),
(6, 3, TRUE, 100, NOW() - INTERVAL '56 days'),
(6, 4, TRUE, 100, NOW() - INTERVAL '55 days'),
(6, 5, TRUE, 95, NOW() - INTERVAL '54 days'),
(6, 6, TRUE, 90, NOW() - INTERVAL '45 days'),
(6, 7, TRUE, 88, NOW() - INTERVAL '44 days'),
(6, 8, TRUE, 92, NOW() - INTERVAL '43 days'),
(6, 9, TRUE, 85, NOW() - INTERVAL '18 days'),
(6, 10, TRUE, 90, NOW() - INTERVAL '17 days'),
(6, 11, TRUE, 95, NOW() - INTERVAL '16 days'),
(6, 12, FALSE, 0, NULL),
(6, 13, FALSE, 0, NULL);

-- ============================
-- POPULATE ACHIEVEMENTS
-- ============================
INSERT INTO "STUDENT_ACHIEVEMENT" ("idUser", "idAchievement", "unlockedAt") VALUES
-- Benzo achievements
(4, 1, NOW() - INTERVAL '28 days'), -- First Steps
(4, 2, NOW() - INTERVAL '60 days'), -- Course Explorer
(4, 3, NOW() - INTERVAL '24 days'), -- Quick Learner
(4, 5, NOW() - INTERVAL '30 days'), -- Course Master

-- Lamass achievements
(5, 1, NOW() - INTERVAL '18 days'),
(5, 2, TRUE, 65, NOW() - INTERVAL '17 days'),
(5, 3, FALSE, 0, NULL),
(5, 15, TRUE, 88, NOW() - INTERVAL '15 days'),
(5, 16, TRUE, 92, NOW() - INTERVAL '14 days'),

-- Islem (student 6) - most advanced, completed many exercises
(6, 1, TRUE, 100, NOW() - INTERVAL '58 days'),
(6, 2, TRUE, 95, NOW() - INTERVAL '57 days'),
(6, 3, TRUE, 100, NOW() - INTERVAL '56 days'),
(6, 4, TRUE, 100, NOW() - INTERVAL '55 days'),
(6, 5, TRUE, 95, NOW() - INTERVAL '54 days'),
(6, 6, TRUE, 90, NOW() - INTERVAL '45 days'),
(6, 7, TRUE, 88, NOW() - INTERVAL '44 days'),
(6, 8, TRUE, 92, NOW() - INTERVAL '43 days'),
(6, 9, TRUE, 85, NOW() - INTERVAL '18 days'),
(6, 10, TRUE, 90, NOW() - INTERVAL '17 days'),
(6, 11, TRUE, 95, NOW() - INTERVAL '16 days'),
(6, 12, FALSE, 0, NULL),
(6, 13, FALSE, 0, NULL);

-- ============================
-- POPULATE ACHIEVEMENTS
-- ============================
INSERT INTO "STUDENT_ACHIEVEMENT" ("idUser", "idAchievement", "unlockedAt") VALUES
-- Benzo achievements
(4, 1, NOW() - INTERVAL '28 days'), -- First Steps
(4, 2, NOW() - INTERVAL '60 days'), -- Course Explorer
(4, 3, NOW() - INTERVAL '24 days'), -- Quick Learner
(4, 5, NOW() - INTERVAL '30 days'), -- Course Master

-- Lamass achievements
(5, 1, NOW() - INTERVAL '18 days'), -- First Steps
(5, 2, NOW() - INTERVAL '20 days'), -- Course Explorer
(5, 3, NOW() - INTERVAL '15 days'), -- Quick Learner

-- Islem achievements (most advanced)
(6, 1, NOW() - INTERVAL '58 days'), -- First Steps
(6, 2, NOW() - INTERVAL '90 days'), -- Course Explorer
(6, 3, NOW() - INTERVAL '54 days'), -- Quick Learner
(6, 4, NOW() - INTERVAL '43 days'), -- Dedicated Student
(6, 5, NOW() - INTERVAL '60 days'), -- Course Master
(6, 6, NOW() - INTERVAL '16 days'), -- Algorithm Expert
(6, 7, NOW() - INTERVAL '20 days'); -- Consistency King

-- ============================
-- POPULATE FEEDBACK
-- ============================
INSERT INTO "FEEDBACK" ("Avis", "idUser") VALUES
('Excellente plateforme! Les exercices sont bien structurés et progressifs.', 4),
('Les explications sont claires, mais j''aimerais plus d''exemples pratiques.', 5),
('Interface intuitive et contenu de qualité. Merci aux enseignants!', 6),
('Le cours sur les graphes est fantastique, très bien expliqué.', 6),
('Bon contenu mais quelques bugs dans l''interface de code.', 4);

-- ============================
-- LINK USERS TO FEEDBACK
-- ============================
INSERT INTO "USER_FEEDBACK" ("idUser", "idFeedback") VALUES
(4, 1),
(4, 5),
(5, 2),
(6, 3),
(6, 4);

-- ============================
-- VERIFICATION QUERIES
-- ============================
-- Run these to verify the data was inserted correctly:

-- SELECT * FROM "USER";
-- SELECT * FROM "ENSEIGNANT";
-- SELECT * FROM "ETUDIANT";
-- SELECT * FROM "COURS";
-- SELECT * FROM "EXERCISE";
-- SELECT * FROM "ETUDIANT_COURS";
-- SELECT * FROM "ETUDIANT_EXERCICE";
-- SELECT * FROM "STUDENT_ACHIEVEMENT";