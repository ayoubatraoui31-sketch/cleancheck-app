import { PrismaClient, TemplateCategory, Severity, ConstatType, SiteType } from '@prisma/client';

const prisma = new PrismaClient();

const bankTemplates = [
  {
    name: 'Dépoussiérage',
    category: TemplateCategory.DEPOUSSIERAGE,
    description: 'Mobilier, écrans, claviers, téléphones, comptoirs',
    deadlineHours: 24,
    severity: Severity.MEDIUM,
    items: [
      { label: 'Bureau et plan de travail', order: 1 },
      { label: 'Écrans d'ordinateur', order: 2 },
      { label: 'Claviers et souris', order: 3 },
      { label: 'Téléphones de bureau', order: 4 },
      { label: 'Comptoirs d'accueil', order: 5 },
      { label: 'Étagères et armoires', order: 6 },
      { label: 'Luminaires et plafonniers', order: 7 },
      { label: 'Rebords de fenêtres', order: 8 },
      { label: 'Plinthe et angles', order: 9 },
    ],
  },
  {
    name: 'Lavage des sols',
    category: TemplateCategory.LAVAGE_SOLS,
    description: 'Hall, bureaux, couloirs, zones communes',
    deadlineHours: 24,
    severity: Severity.MEDIUM,
    items: [
      { label: 'Hall d'accueil', order: 1 },
      { label: 'Couloirs et circulations', order: 2 },
      { label: 'Bureaux et postes de travail', order: 3 },
      { label: 'Salle de réunion', order: 4 },
      { label: 'Salle de pause / cafétéria', order: 5 },
      { label: 'Back-office', order: 6 },
      { label: 'Escaliers', order: 7 },
      { label: 'Sas d'entrée sécurisé', order: 8 },
    ],
  },
  {
    name: 'Nettoyage des vitres',
    category: TemplateCategory.NETTOYAGE_VITRES,
    description: 'Vitrines extérieures, cloisons intérieures, miroirs',
    deadlineHours: 72,
    severity: Severity.LOW,
    items: [
      { label: 'Vitrines extérieures (façade)', order: 1 },
      { label: 'Portes vitrées d'entrée', order: 2 },
      { label: 'Cloisons vitrées intérieures', order: 3 },
      { label: 'Miroirs sanitaires', order: 4 },
      { label: 'Encadrements et joints', order: 5 },
      { label: 'Surfaces hautes (échafaudage requis)', order: 6 },
    ],
  },
  {
    name: 'Nettoyage des sanitaires',
    category: TemplateCategory.NETTOYAGE_SANITAIRES,
    description: 'WC, lavabos, miroirs, consommables',
    deadlineHours: 4,
    severity: Severity.CRITICAL,
    items: [
      { label: 'Cuvettes WC (intérieur/extérieur)', order: 1 },
      { label: 'Lavabos et robinetterie', order: 2 },
      { label: 'Miroirs', order: 3 },
      { label: 'Sol des sanitaires', order: 4 },
      { label: 'Poubelles vidées et sac changé', order: 5 },
      { label: 'Papier hygiénique approvisionné', order: 6 },
      { label: 'Savon liquide approvisionné', order: 7 },
      { label: 'Essuie-mains / sèche-mains', order: 8 },
      { label: 'Odeur et aération', order: 9 },
    ],
  },
  {
    name: 'Désinfection des surfaces',
    category: TemplateCategory.DESINFECTION_SURFACES,
    description: 'Guichets, poignées de portes, interrupteurs, zones de contact',
    deadlineHours: 24,
    severity: Severity.HIGH,
    items: [
      { label: 'Guichets et comptoirs clients', order: 1 },
      { label: 'Poignées de portes', order: 2 },
      { label: 'Interrupteurs et boutons', order: 3 },
      { label: 'Téléphones et équipements partagés', order: 4 },
      { label: 'Claviers de saisie / Pinpad', order: 5 },
      { label: 'Rampes d'escalier', order: 6 },
      { label: 'Distributeur de tickets', order: 7 },
      { label: 'Zone d'attente (accoudoirs, sièges)', order: 8 },
    ],
  },
  {
    name: 'Décapage / Cristallisation des sols',
    category: TemplateCategory.DECAPAGE_CRISTALLISATION,
    description: 'Remise en état des sols (marbre, carrelage, parquet)',
    deadlineHours: 240, // 10 jours ouvrés
    severity: Severity.LOW,
    items: [
      { label: 'État général de la surface', order: 1 },
      { label: 'Perte de brillance constatée', order: 2 },
      { label: 'Rayures ou micro-griffures', order: 3 },
      { label: 'Taches incrustées', order: 4 },
      { label: 'Zones décollées ou dégradées', order: 5 },
      { label: 'Résultat après traitement (si reprise)', order: 6 },
    ],
  },
  {
    name: 'Nettoyage des DAB / GAB',
    category: TemplateCategory.NETTOYAGE_DAB_GAB,
    description: 'Distributeurs automatiques de billets — zones sensibles',
    deadlineHours: 24,
    severity: Severity.HIGH,
    items: [
      { label: 'Écran tactile / écran de saisie', order: 1 },
      { label: 'Clavier de saisie (pinpad)', order: 2 },
      { label: 'Trappe de distribution des billets', order: 3 },
      { label: 'Contour et carrosserie du DAB', order: 4 },
      { label: 'Sol devant le DAB', order: 5 },
      { label: 'Éclairage du DAB', order: 6 },
      { label: 'Signalétique et autocollants', order: 7 },
    ],
  },
];

async function main() {
  // Créer organisation
  const org = await prisma.organization.create({
    data: {
      name: 'Banque Démo',
      siret: '12345678900012',
      plan: 'PROFESSIONAL',
    },
  });

  console.log(`✅ Organisation créée : ${org.name}`);

  // Créer sites (agences bancaires)
  const sites = await Promise.all([
    prisma.site.create({
      data: {
        name: 'Agence Centrale Paris',
        address: '12 Avenue de l'Opéra, 75001 Paris',
        latitude: 48.8566,
        longitude: 2.3522,
        siteType: SiteType.AGENCE_BANCAIRE,
        orgId: org.id,
      },
    }),
    prisma.site.create({
      data: {
        name: 'Agence Lyon Part-Dieu',
        address: '45 Boulevard Marius Vivier Merle, 69003 Lyon',
        latitude: 45.7600,
        longitude: 4.8600,
        siteType: SiteType.AGENCE_BANCAIRE,
        orgId: org.id,
      },
    }),
    prisma.site.create({
      data: {
        name: 'Agence Marseille Vieux-Port',
        address: '78 La Canebière, 13001 Marseille',
        latitude: 43.2965,
        longitude: 5.3698,
        siteType: SiteType.AGENCE_BANCAIRE,
        orgId: org.id,
      },
    }),
  ]);

  console.log(`✅ ${sites.length} agences bancaires créées`);

  // Créer templates d'inspection
  for (const template of bankTemplates) {
    const created = await prisma.inspectionTemplate.create({
      data: {
        name: template.name,
        description: template.description,
        category: template.category,
        deadlineHours: template.deadlineHours,
        severity: template.severity,
        isDefault: true,
        orgId: org.id,
        items: {
          create: template.items.map((item) => ({
            label: item.label,
            order: item.order,
            maxScore: 5,
            photoRequired: false,
          })),
        },
      },
    });
    console.log(`✅ Template créé : ${created.name} (${template.items.length} items, délai: ${template.deadlineHours}h)`);
  }

  console.log('\n⚠️  Utilisateurs : créez-les via Clerk auth, puis appelez POST /api/auth/sync');
  console.log('   avec orgId:', org.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
