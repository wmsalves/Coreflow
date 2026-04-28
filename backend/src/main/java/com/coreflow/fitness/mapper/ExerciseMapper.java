package com.coreflow.fitness.mapper;

import com.coreflow.fitness.dto.ExerciseResponse;
import com.coreflow.fitness.dto.ExerciseDetailResponse;
import com.coreflow.fitness.dto.ExerciseMediaResponse;
import com.coreflow.fitness.dto.ExerciseSummaryResponse;
import com.coreflow.fitness.entity.ExerciseEntity;
import com.coreflow.fitness.model.ExerciseEnrichment;
import com.coreflow.fitness.support.ExerciseDataNormalizer;
import com.coreflow.fitness.support.ExerciseDataNormalizer.ResolvedMedia;
import com.coreflow.fitness.support.ExerciseMetadataEnricher;
import org.springframework.stereotype.Component;

@Component
public class ExerciseMapper {

    private static final String DEFAULT_BODY_PART = "Full Body";

    private final ExerciseMetadataEnricher metadataEnricher;

    public ExerciseMapper(ExerciseMetadataEnricher metadataEnricher) {
        this.metadataEnricher = metadataEnricher;
    }

    public ExerciseResponse toResponse(ExerciseEntity entity) {
        ExerciseMedia media = resolveMedia(entity);
        ExerciseEnrichment enrichment = metadataEnricher.enrich(entity);
        String bodyPart = cleanBodyPart(entity);
        String target = cleanTarget(entity, enrichment);
        return new ExerciseResponse(
                entity.getId(),
                ExerciseDataNormalizer.cleanText(entity.getExternalId()),
                ExerciseDataNormalizer.cleanText(entity.getSource()),
                ExerciseDataNormalizer.cleanName(entity.getName()),
                media.gifUrl(),
                media.imageUrl(),
                media.videoUrl(),
                media.mediaUrl(),
                media.resolvedMedia(),
                bodyPart,
                target,
                enrichment.category(),
                target,
                enrichment.equipment(),
                enrichment.difficulty(),
                enrichment.muscles(),
                ExerciseDataNormalizer.cleanInstructions(entity.getSecondaryMuscles()),
                ExerciseDataNormalizer.cleanInstructions(entity.getInstructions())
        );
    }

    public ExerciseSummaryResponse toSummaryResponse(ExerciseEntity entity) {
        ExerciseMedia media = resolveMedia(entity);
        ExerciseEnrichment enrichment = metadataEnricher.enrich(entity);
        return new ExerciseSummaryResponse(
                resolveCatalogId(entity),
                entity.getId(),
                ExerciseDataNormalizer.cleanName(entity.getName()),
                media.gifUrl(),
                media.imageUrl(),
                media.videoUrl(),
                media.mediaUrl(),
                media.resolvedMedia(),
                cleanBodyPart(entity),
                cleanTarget(entity, enrichment),
                enrichment.equipment(),
                enrichment.difficulty(),
                enrichment.category(),
                enrichment.muscles()
        );
    }

    public ExerciseDetailResponse toDetailResponse(ExerciseEntity entity) {
        ExerciseMedia media = resolveMedia(entity);
        ExerciseEnrichment enrichment = metadataEnricher.enrich(entity);
        return new ExerciseDetailResponse(
                resolveCatalogId(entity),
                entity.getId(),
                ExerciseDataNormalizer.cleanName(entity.getName()),
                media.gifUrl(),
                media.imageUrl(),
                media.videoUrl(),
                media.mediaUrl(),
                media.resolvedMedia(),
                cleanBodyPart(entity),
                cleanTarget(entity, enrichment),
                enrichment.equipment(),
                enrichment.difficulty(),
                enrichment.category(),
                enrichment.muscles(),
                ExerciseDataNormalizer.cleanInstructions(entity.getSecondaryMuscles()),
                ExerciseDataNormalizer.cleanInstructions(entity.getInstructions())
        );
    }

    private String resolveCatalogId(ExerciseEntity entity) {
        if (entity.getExternalId() != null
                && !entity.getExternalId().isBlank()
                && !"local".equalsIgnoreCase(entity.getSource())) {
            return entity.getExternalId();
        }
        if (entity.getId() != null) {
            return String.valueOf(entity.getId());
        }
        if (entity.getExternalId() != null && !entity.getExternalId().isBlank()) {
            return entity.getExternalId();
        }
        return "";
    }

    private ExerciseMedia resolveMedia(ExerciseEntity entity) {
        String gifUrl = ExerciseDataNormalizer.cleanUrl(entity.getGifUrl());
        String imageUrl = ExerciseDataNormalizer.cleanUrl(entity.getImageUrl());
        String videoUrl = ExerciseDataNormalizer.cleanUrl(entity.getVideoUrl());
        ResolvedMedia resolvedMedia = ExerciseDataNormalizer.resolveMedia(gifUrl, imageUrl, videoUrl);
        return new ExerciseMedia(
                gifUrl,
                imageUrl,
                videoUrl,
                resolvedMedia == null ? null : resolvedMedia.url(),
                resolvedMedia == null ? null : new ExerciseMediaResponse(resolvedMedia.type(), resolvedMedia.url())
        );
    }

    private String cleanBodyPart(ExerciseEntity entity) {
        String bodyPart = ExerciseDataNormalizer.cleanLabel(entity.getBodyPart());
        return bodyPart == null ? DEFAULT_BODY_PART : bodyPart;
    }

    private String cleanTarget(ExerciseEntity entity, ExerciseEnrichment enrichment) {
        String target = ExerciseDataNormalizer.cleanLabel(entity.getTarget());
        if (target != null) {
            return target;
        }
        if (!enrichment.muscles().isEmpty()) {
            return enrichment.muscles().getFirst();
        }
        return DEFAULT_BODY_PART;
    }

    private record ExerciseMedia(
            String gifUrl,
            String imageUrl,
            String videoUrl,
            String mediaUrl,
            ExerciseMediaResponse resolvedMedia
    ) {
    }
}
