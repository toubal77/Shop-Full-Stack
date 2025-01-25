package fr.fullstack.shopapp.controller;

import fr.fullstack.shopapp.service.ElasticsearchService;
import fr.fullstack.shopapp.model.Shop;
import fr.fullstack.shopapp.service.ShopService;
import fr.fullstack.shopapp.util.ErrorValidation;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/shops")
public class ShopController {

    @Autowired
    private ShopService service;
    @Autowired
    private ElasticsearchService elasticsearchService;

    @Operation(summary = "Create a shop", description = "Creates a new shop in the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Shop successfully created"),
            @ApiResponse(responseCode = "400", description = "Validation error or bad request")
    })
    @PostMapping
    public ResponseEntity<Shop> createShop(@Valid @RequestBody Shop shop, Errors errors) {
        if (errors.hasErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, ErrorValidation.getErrorValidationMessage(errors));
        }

        try {
            return ResponseEntity.ok(service.createShop(shop));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Delete a shop", description = "Deletes a shop by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Shop successfully deleted"),
            @ApiResponse(responseCode = "400", description = "Bad request or invalid ID")
    })
    @DeleteMapping("/{id}")
    public HttpStatus deleteShop(@PathVariable long id) {
        try {
            service.deleteShopById(id);
            return HttpStatus.NO_CONTENT;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Get all shops", description = "Retrieves a paginated list of shops with optional filters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "List of shops"),
            @ApiResponse(responseCode = "400", description = "Invalid request parameters")
    })
    @GetMapping
    public ResponseEntity<Page<Shop>> getAllShops(
            Pageable pageable,
            @Parameter(description = "Sort the shops by specific fields (e.g., name, nbProducts, createdAt)")
            @RequestParam(required = false) Optional<String> sortBy,
            @Parameter(description = "Filter shops by vacation status")
            @RequestParam(required = false) Optional<Boolean> inVacations,
            @Parameter(description = "Filter shops created after a specific date (format: yyyy-MM-dd)")
            @RequestParam(required = false) Optional<String> createdAfter,
            @Parameter(description = "Filter shops created before a specific date (format: yyyy-MM-dd)")
            @RequestParam(required = false) Optional<String> createdBefore
    ) {
        return ResponseEntity.ok(
                service.getShopList(sortBy, inVacations, createdAfter, createdBefore, pageable)
        );
    }

    @Operation(summary = "Get a shop by ID", description = "Retrieves a shop by its unique ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Shop details"),
            @ApiResponse(responseCode = "400", description = "Invalid shop ID")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Shop> getShopById(@PathVariable long id) {
        try {
            return ResponseEntity.ok().body(service.getShopById(id));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Operation(summary = "Update a shop", description = "Updates the details of an existing shop")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Shop successfully updated",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "400", description = "Validation error or bad request")
    })
    @PutMapping
    public ResponseEntity<Shop> updateShop(@Valid @RequestBody Shop shop, Errors errors) {
        if (errors.hasErrors()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, ErrorValidation.getErrorValidationMessage(errors));
        }

        try {
            return ResponseEntity.ok().body(service.updateShop(shop));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/search")
    @Operation(summary = "Search shops with Elasticsearch", description = "Full text search on shops with filters")
    public ResponseEntity<Page<Shop>> searchShops(
            @Parameter(description = "Text to search in shop names")
            @RequestParam(required = false) String searchText,
            @Parameter(description = "Filter shops by vacation status")
            @RequestParam(required = false) Optional<Boolean> inVacations,
            @Parameter(description = "Filter shops created after date (format: yyyy-MM-dd)")
            @RequestParam(required = false) Optional<LocalDate> createdAfter,
            @Parameter(description = "Filter shops created before date (format: yyyy-MM-dd)")
            @RequestParam(required = false) Optional<LocalDate> createdBefore,
            Pageable pageable) {

        return ResponseEntity.ok(elasticsearchService.searchShops(
                searchText, inVacations, createdAfter, createdBefore, pageable));
    }

    @PostMapping("/reindex")
    @Operation(summary = "Reindex all shops in Elasticsearch")
    public ResponseEntity<Void> reindexAll() {
        try {
            elasticsearchService.reindexAll();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error during reindexing: " + e.getMessage());
        }
    }
}