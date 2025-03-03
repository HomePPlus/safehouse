package com.safehouse.api.dashboard.defect;

import com.safehouse.common.response.ApiResponse;
import com.safehouse.domain.dashboard.defect.service.ReportDefectStatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard/defects")
@RequiredArgsConstructor
public class ReportDefectStatController {

    private final ReportDefectStatService reportDefectStatService;

    @GetMapping("/stats")
    public ApiResponse<?> getDefectStatistics(
            @RequestParam(name = "area", defaultValue = "부산시") String area
    ) {
        return reportDefectStatService.getDefectStats(area);
    }
}