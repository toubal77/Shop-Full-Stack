package fr.fullstack.shopapp.service;

import fr.fullstack.shopapp.model.Shop;
import jakarta.persistence.EntityManager;
import org.hibernate.search.engine.search.predicate.dsl.MatchAllPredicateOptionsStep;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ElasticsearchService {

    @Autowired
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public Page<Shop> searchShops(
            String searchText,
            Optional<Boolean> inVacations,
            Optional<LocalDate> createdAfter,
            Optional<LocalDate> createdBefore,
            Pageable pageable) {

        SearchSession searchSession = Search.session(entityManager);

        var query = searchSession.search(Shop.class)
                .where(f -> {
                    var predicate = f.matchAll();

                    if (searchText != null && !searchText.isEmpty()) {
                        predicate = (MatchAllPredicateOptionsStep<?>) f.match()
                                .field("name")
                                .matching(searchText);
                    }

                    if (inVacations.isPresent()) {
                        predicate = (MatchAllPredicateOptionsStep<?>) f.bool()
                                .must(predicate)
                                .must(f.match()
                                        .field("inVacations")
                                        .matching(inVacations.get()));
                    }

                    if (createdAfter.isPresent()) {
                        predicate = (MatchAllPredicateOptionsStep<?>) f.bool()
                                .must(predicate)
                                .must(f.range()
                                        .field("createdAt")
                                        .atLeast(createdAfter.get()));
                    }

                    if (createdBefore.isPresent()) {
                        predicate = (MatchAllPredicateOptionsStep<?>) f.bool()
                                .must(predicate)
                                .must(f.range()
                                        .field("createdAt")
                                        .atMost(createdBefore.get()));
                    }

                    return predicate;
                });

        // Pagination
        List<Shop> hits = query
                .fetchHits((int) pageable.getOffset(), pageable.getPageSize());

        // Total result count for pagination
        long totalHitCount = query.fetchTotalHitCount();

        return new PageImpl<>(hits, pageable, totalHitCount);
    }

    @Transactional
    public void reindexAll() throws InterruptedException {
        SearchSession searchSession = Search.session(entityManager);
        searchSession.massIndexer(Shop.class)  // Spécifier explicitement la classe
                .dropAndCreateSchemaOnStart(true)  // Recréer le schéma
                .typesToIndexInParallel(1)  // Limiter le parallélisme
                .batchSizeToLoadObjects(10)  // Réduire la taille des lots
                .threadsToLoadObjects(1)     // Limiter les threads
                .startAndWait();
    }
}