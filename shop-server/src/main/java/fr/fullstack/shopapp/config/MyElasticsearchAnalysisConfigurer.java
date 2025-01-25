package fr.fullstack.shopapp.config;

import org.hibernate.search.backend.elasticsearch.analysis.ElasticsearchAnalysisConfigurationContext;
import org.hibernate.search.backend.elasticsearch.analysis.ElasticsearchAnalysisConfigurer;
import org.springframework.stereotype.Component;

@Component
public class MyElasticsearchAnalysisConfigurer implements ElasticsearchAnalysisConfigurer {
    @Override
    public void configure(ElasticsearchAnalysisConfigurationContext context) {
        context.analyzer("custom_analyzer").custom()
                .tokenizer("standard")
                .tokenFilters("lowercase", "asciifolding");

        context.normalizer("custom_normalizer").custom()
                .tokenFilters("lowercase", "asciifolding");
    }
}