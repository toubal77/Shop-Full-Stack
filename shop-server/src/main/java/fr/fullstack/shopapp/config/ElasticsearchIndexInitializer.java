package fr.fullstack.shopapp.config;

import fr.fullstack.shopapp.service.ElasticsearchService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class ElasticsearchIndexInitializer implements ApplicationListener<ApplicationReadyEvent> {

    @Autowired
    private ElasticsearchService elasticsearchService;

    @Override
    @Transactional
    public void onApplicationEvent(ApplicationReadyEvent event) {
        try {
            elasticsearchService.reindexAll();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to initialize Elasticsearch index", e);
        }
    }
}