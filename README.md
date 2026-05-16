# cleancheck-app
Application de propreté 
html_content = '''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CleanCheck - Application de Constat de Propreté</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --success: #16a34a;
            --danger: #dc2626;
            --warning: #f59e0b;
            --gray-100: #f3f4f6;
            --gray-200: #e5e7eb;
            --gray-300: #d1d5db;
            --gray-600: #4b5563;
            --gray-800: #1f2937;
            --gray-900: #111827;
        }

        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: var(--gray-100);
            color: var(--gray-900);
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }

        header h1 {
            font-size: 1.8rem;
            margin-bottom: 8px;
        }

        header p {
            opacity: 0.9;
            font-size: 0.95rem;
        }

        .nav-tabs {
            display: flex;
            background: white;
            border-radius: 12px;
            padding: 6px;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            gap: 4px;
        }

        .nav-tab {
            flex: 1;
            padding: 12px;
            border: none;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            color: var(--gray-600);
            transition: all 0.2s;
            font-size: 0.9rem;
            position: relative;
        }

        .nav-tab:hover {
            background: var(--gray-100);
        }

        .nav-tab.active {
            background: var(--primary);
            color: white;
        }

        .nav-tab .badge {
            position: absolute;
            top: 4px;
            right: 4px;
            background: var(--danger);
            color: white;
            font-size: 0.65rem;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: 700;
        }

        .section {
            display: none;
            animation: fadeIn 0.3s ease;
        }

        .section.active {
            display: block;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .card {
            background: white;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .card-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--gray-800);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--gray-800);
            font-size: 0.9rem;
        }

        input[type="text"],
        input[type="number"],
        textarea,
        select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--gray-200);
            border-radius: 10px;
            font-size: 1rem;
            transition: border-color 0.2s;
            font-family: inherit;
        }

        input:focus,
        textarea:focus,
        select:focus {
            outline: none;
            border-color: var(--primary);
        }

        textarea {
            min-height: 80px;
            resize: vertical;
        }

        .photo-upload {
            border: 3px dashed var(--gray-300);
            border-radius: 12px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
            background: var(--gray-100);
        }

        .photo-upload:hover {
            border-color: var(--primary);
            background: #eff6ff;
        }

        .photo-upload.has-image {
            padding: 0;
            border: none;
            background: transparent;
        }

        .photo-upload input {
            display: none;
        }

        .photo-upload .upload-icon {
            font-size: 3rem;
            margin-bottom: 10px;
        }

        .photo-upload .upload-text {
            color: var(--gray-600);
            font-size: 0.9rem;
        }

        .photo-preview {
            width: 100%;
            max-height: 300px;
            object-fit: cover;
            border-radius: 12px;
        }

        .location-info {
            background: #eff6ff;
            border-radius: 10px;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            color: var(--primary-dark);
        }

        .location-info.error {
            background: #fef2f2;
            color: var(--danger);
        }

        .btn {
            padding: 14px 28px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
            width: 100%;
        }

        .btn-primary:hover {
            background: var(--primary-dark);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .btn-success {
            background: var(--success);
            color: white;
        }

        .btn-success:hover {
            background: #15803d;
        }

        .btn-danger {
            background: var(--danger);
            color: white;
        }

        .btn-danger:hover {
            background: #b91c1c;
        }

        .btn-secondary {
            background: var(--gray-200);
            color: var(--gray-800);
        }

        .btn-secondary:hover {
            background: var(--gray-300);
        }

        .btn-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .btn-group .btn {
            flex: 1;
        }

        /* Liste des constats */
        .constat-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .constat-item {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .constat-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .constat-header {
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1px solid var(--gray-100);
        }

        .constat-title {
            font-weight: 700;
            font-size: 1.05rem;
            color: var(--gray-800);
            margin-bottom: 4px;
        }

        .constat-meta {
            font-size: 0.8rem;
            color: var(--gray-600);
        }

        .status-badge {
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }

        .status-responded {
            background: #dbeafe;
            color: #1e40af;
        }

        .status-validated {
            background: #d1fae5;
            color: #065f46;
        }

        .status-rejected {
            background: #fee2e2;
            color: #991b1b;
        }

        .status-expired {
            background: var(--gray-200);
            color: var(--gray-600);
        }

        .constat-body {
            padding: 16px 20px;
        }

        .constat-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 12px;
        }

        .constat-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            font-size: 0.85rem;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .detail-label {
            font-weight: 600;
            color: var(--gray-600);
            font-size: 0.75rem;
            text-transform: uppercase;
        }

        .detail-value {
            color: var(--gray-800);
            font-weight: 500;
        }

        .countdown {
            font-family: 'Courier New', monospace;
            font-weight: 700;
            color: var(--danger);
        }

        .constat-actions {
            padding: 16px 20px;
            background: var(--gray-50);
            display: flex;
            gap: 10px;
        }

        .constat-actions .btn {
            flex: 1;
            padding: 10px;
            font-size: 0.9rem;
        }

        /* Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        }

        .modal-overlay.active {
            display: flex;
        }

        .modal {
            background: white;
            border-radius: 20px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalIn 0.3s ease;
        }

        @keyframes modalIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
            padding: 24px 24px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            font-size: 1.3rem;
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--gray-600);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .modal-close:hover {
            background: var(--gray-100);
        }

        .modal-body {
            padding: 20px 24px;
        }

        .modal-footer {
            padding: 0 24px 24px;
            display: flex;
            gap: 10px;
        }

        .modal-footer .btn {
            flex: 1;
        }

        .comparison {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }

        .comparison-item {
            text-align: center;
        }

        .comparison-item img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 8px;
        }

        .comparison-label {
            font-weight: 700;
            font-size: 0.85rem;
            color: var(--gray-600);
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: var(--gray-600);
        }

        .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .empty-state h3 {
            font-size: 1.2rem;
            margin-bottom: 8px;
            color: var(--gray-800);
        }

        .toast {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: var(--gray-800);
            color: white;
            padding: 14px 28px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 2000;
            transition: transform 0.3s ease;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .toast.show {
            transform: translateX(-50%) translateY(0);
        }

        .toast.success {
            background: var(--success);
        }

        .toast.error {
            background: var(--danger);
        }

        .filter-bar {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 8px 16px;
            border: 2px solid var(--gray-200);
            background: white;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
            color: var(--gray-600);
            transition: all 0.2s;
        }

        .filter-btn:hover,
        .filter-btn.active {
            border-color: var(--primary);
            color: var(--primary);
            background: #eff6ff;
        }

        .rejection-reason {
            background: #fef2f2;
            border-left: 4px solid var(--danger);
            padding: 12px 16px;
            border-radius: 0 8px 8px 0;
            margin-top: 12px;
            font-size: 0.9rem;
            color: #7f1d1d;
        }

        @media (max-width: 600px) {
            .comparison {
                grid-template-columns: 1fr;
            }
            .constat-details {
                grid-template-columns: 1fr;
            }
            header h1 {
                font-size: 1.4rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>🧹 CleanCheck</h1>
        <p>Application de constat et suivi de propreté</p>
    </header>

    <div class="container">
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showSection('create')">
                📝 Nouveau constat
            </button>
            <button class="nav-tab" onclick="showSection('sent')">
                📤 Mes constats
                <span class="badge" id="badge-sent" style="display:none">0</span>
            </button>
            <button class="nav-tab" onclick="showSection('received')">
                📥 À traiter
                <span class="badge" id="badge-received" style="display:none">0</span>
            </button>
        </div>

        <!-- SECTION: Créer un constat -->
        <div id="section-create" class="section active">
            <div class="card">
                <div class="card-title">
                    <span>📝</span>
                    Créer un nouveau constat de propreté
                </div>

                <div class="form-group">
                    <label>Titre du constat</label>
                    <input type="text" id="constat-title" placeholder="Ex: Zone de stockage débordante">
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea id="constat-desc" placeholder="Décrivez le problème de propreté constaté..."></textarea>
                </div>

                <div class="form-group">
                    <label>Photo du constat</label>
                    <div class="photo-upload" id="upload-before" onclick="document.getElementById('file-before').click()">
                        <input type="file" id="file-before" accept="image/*" onchange="handleImageUpload(this, 'upload-before')">
                        <div class="upload-content">
                            <div class="upload-icon">📷</div>
                            <div class="upload-text">Cliquez pour prendre ou importer une photo</div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>Localisation</label>
                    <div class="location-info" id="location-info">
                        <span>📍</span>
                        <span id="location-text">Récupération de la position en cours...</span>
                    </div>
                </div>

                <div class="form-group">
                    <label>Délai de nettoyage (heures)</label>
                    <input type="number" id="constat-duration" value="24" min="1" max="168">
                </div>

                <div class="form-group">
                    <label>Destinataire (nom ou email)</label>
                    <input type="text" id="constat-recipient" placeholder="Ex: Jean Dupont / maintenance@entreprise.fr">
                </div>

                <button class="btn btn-primary" onclick="createConstat()">
                    🚀 Envoyer le constat
                </button>
            </div>
        </div>

        <!-- SECTION: Constats envoyés -->
        <div id="section-sent" class="section">
            <div class="filter-bar">
                <button class="filter-btn active" onclick="filterConstats('sent', 'all')">Tous</button>
                <button class="filter-btn" onclick="filterConstats('sent', 'pending')">En attente</button>
                <button class="filter-btn" onclick="filterConstats('sent', 'responded')">À valider</button>
                <button class="filter-btn" onclick="filterConstats('sent', 'validated')">Validés</button>
                <button class="filter-btn" onclick="filterConstats('sent', 'rejected')">Rejetés</button>
            </div>
            <div class="constat-list" id="sent-list">
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>Aucun constat envoyé</h3>
                    <p>Créez votre premier constat de propreté</p>
                </div>
            </div>
        </div>

        <!-- SECTION: Constats reçus -->
        <div id="section-received" class="section">
            <div class="filter-bar">
                <button class="filter-btn active" onclick="filterConstats('received', 'all')">Tous</button>
                <button class="filter-btn" onclick="filterConstats('received', 'pending')">En attente</button>
                <button class="filter-btn" onclick="filterConstats('received', 'responded')">Traités</button>
                <button class="filter-btn" onclick="filterConstats('received', 'expired')">Expirés</button>
            </div>
            <div class="constat-list" id="received-list">
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <h3>Aucun constat reçu</h3>
                    <p>Vous n'avez pas de constat à traiter pour le moment</p>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL: Répondre à un constat -->
    <div class="modal-overlay" id="modal-respond">
        <div class="modal">
            <div class="modal-header">
                <h2>📸 Répondre au constat</h2>
                <button class="modal-c
