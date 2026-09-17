import os
from django.core.management.base import BaseCommand
from core.models import BodySystem, AnatomyLayer, Organ, Disease, ResearchPaper
import datetime

class Command(BaseCommand):
    help = 'Seeds the database with comprehensive data about the human Brain'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting to seed Brain data...")

        # 1. Create Body System
        nervous_system, created = BodySystem.objects.get_or_create(
            name="Nervous System",
            defaults={
                "description": "The complex network of nerves and cells that carry messages to and from the brain and spinal cord to various parts of the body.",
                "icon": "brain",
                "order": 1
            }
        )

        # 2. Create Anatomy Layer
        cns_layer, created = AnatomyLayer.objects.get_or_create(
            name="Central Nervous System",
            body_system=nervous_system,
            defaults={
                "description": "Consists of the brain and spinal cord. It integrates information it receives from, and coordinates and influences the activity of, all parts of the bodies of bilaterally symmetric animals.",
                "order": 1
            }
        )

        # 3. Create Organ (Brain)
        brain, created = Organ.objects.get_or_create(
            name="Brain",
            defaults={
                "description": "The central organ of the human nervous system.",
                "layer": cns_layer,
                "body_system": nervous_system,
                "model_name_3d": "Brain",
                "position_x": 0.0,
                "position_y": 1.5,
                "position_z": 0.0
            }
        )

        # 4. Create Diseases and 5. Research Papers
        diseases_data = [
            {
                "name": "Alzheimer's Disease",
                "description": "A progressive neurodegenerative disease that destroys memory and other important mental functions.",
                "symptoms": "Memory loss, confusion, difficulty with language, mood swings, loss of motivation, poor self-care.",
                "causes": "Genetic factors, protein accumulation (amyloid plaques and tau tangles), age-related brain changes.",
                "treatments": "No cure. Medications to manage symptoms (e.g., donepezil, rivastigmine), lifestyle interventions, supportive care.",
                "severity": "severe",
                "prevalence": "Common (millions affected worldwide)",
                "papers": [
                    {
                        "title": "Recent advances in Alzheimer's disease research and therapy",
                        "authors": "Smith, J., Doe, A.",
                        "abstract": "This paper reviews the recent therapeutic approaches targeting amyloid and tau pathways in Alzheimer's patients.",
                        "doi_url": "https://doi.org/10.mock/alz",
                        "pubmed_id": "12345001",
                        "publication_date": datetime.date(2025, 1, 15)
                    }
                ]
            },
            {
                "name": "Parkinson's Disease",
                "description": "A long-term degenerative disorder of the central nervous system that mainly affects the motor system.",
                "symptoms": "Tremors, stiffness, slowness of movement (bradykinesia), difficulty with balance and coordination.",
                "causes": "Loss of dopamine-producing brain cells, genetic mutations, environmental factors.",
                "treatments": "Levodopa/carbidopa, dopamine agonists, MAO-B inhibitors, deep brain stimulation (DBS), physical therapy.",
                "severity": "severe",
                "prevalence": "More common in older adults",
                "papers": [
                    {
                        "title": "Dopaminergic pathways and neurodegeneration in Parkinson's",
                        "authors": "Brown, T., White, W.",
                        "abstract": "A comprehensive study on the progressive loss of substantia nigra dopaminergic neurons.",
                        "doi_url": "https://doi.org/10.mock/pd",
                        "pubmed_id": "12345002",
                        "publication_date": datetime.date(2024, 8, 22)
                    }
                ]
            },
            {
                "name": "Stroke",
                "description": "A medical condition in which poor blood flow to the brain causes cell death.",
                "symptoms": "Sudden numbness or weakness in the face, arm, or leg (especially on one side), confusion, trouble speaking or seeing.",
                "causes": "Blocked artery (ischemic stroke) or leaking/bursting of a blood vessel (hemorrhagic stroke).",
                "treatments": "Thrombolytics (TPA), endovascular procedures, surgery, rehabilitation therapy, blood thinners.",
                "severity": "critical",
                "prevalence": "Leading cause of disability globally",
                "papers": [
                    {
                        "title": "Thrombolytic therapy efficacy in acute ischemic stroke",
                        "authors": "Johnson, M.",
                        "abstract": "Evaluation of time-dependent outcomes for tPA administration following acute ischemic stroke.",
                        "doi_url": "https://doi.org/10.mock/stroke",
                        "pubmed_id": "12345003",
                        "publication_date": datetime.date(2026, 2, 10)
                    }
                ]
            },
            {
                "name": "Epilepsy",
                "description": "A central nervous system (neurological) disorder in which brain activity becomes abnormal, causing seizures or periods of unusual behavior.",
                "symptoms": "Temporary confusion, staring spells, uncontrollable jerking movements of the arms and legs, loss of consciousness or awareness.",
                "causes": "Genetic influence, head trauma, brain conditions (tumors, strokes), infectious diseases, prenatal injury.",
                "treatments": "Anti-seizure medications, vagus nerve stimulation, ketogenic diet, brain surgery.",
                "severity": "moderate",
                "prevalence": "Affects millions of people worldwide",
                "papers": [
                    {
                        "title": "Modern antiepileptic drugs and their mechanisms of action",
                        "authors": "Williams, R., Davis, K.",
                        "abstract": "A review of newer generation antiepileptic drugs and their efficacy in managing refractory epilepsy.",
                        "doi_url": "https://doi.org/10.mock/epilepsy",
                        "pubmed_id": "12345004",
                        "publication_date": datetime.date(2023, 11, 5)
                    }
                ]
            },
            {
                "name": "Migraine",
                "description": "A neurological condition that can cause multiple symptoms, frequently characterized by intense, debilitating headaches.",
                "symptoms": "Throbbing pain usually on one side of the head, nausea, vomiting, sensitivity to light and sound, aura.",
                "causes": "Genetics, environmental factors, changes in the brainstem and its interactions with the trigeminal nerve, imbalances in brain chemicals.",
                "treatments": "Pain relievers, triptans, ergotamine medications, anti-nausea drugs, preventive medications (CGRP antagonists).",
                "severity": "moderate",
                "prevalence": "Very common",
                "papers": [
                    {
                        "title": "The role of CGRP in migraine pathophysiology and treatment",
                        "authors": "Garcia, L., Martinez, E.",
                        "abstract": "An overview of calcitonin gene-related peptide and the development of targeted therapies for migraine prevention.",
                        "doi_url": "https://doi.org/10.mock/migraine",
                        "pubmed_id": "12345005",
                        "publication_date": datetime.date(2025, 6, 18)
                    }
                ]
            }
        ]

        for d_data in diseases_data:
            disease, created = Disease.objects.get_or_create(
                name=d_data["name"],
                defaults={
                    "description": d_data["description"],
                    "symptoms": d_data["symptoms"],
                    "causes": d_data["causes"],
                    "treatments": d_data["treatments"],
                    "severity": d_data["severity"],
                    "prevalence": d_data["prevalence"]
                }
            )
            disease.organ.add(brain)
            
            for p_data in d_data["papers"]:
                paper, p_created = ResearchPaper.objects.get_or_create(
                    title=p_data["title"],
                    defaults={
                        "authors": p_data["authors"],
                        "abstract": p_data["abstract"],
                        "doi_url": p_data["doi_url"],
                        "pubmed_id": p_data["pubmed_id"],
                        "publication_date": p_data["publication_date"]
                    }
                )
                paper.disease.add(disease)

        self.stdout.write(self.style.SUCCESS('Successfully seeded Brain data!'))
