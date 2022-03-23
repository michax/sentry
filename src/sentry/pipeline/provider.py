from __future__ import annotations

from typing import Any, Mapping, Sequence

from . import Pipeline
from .views.base import PipelineView


class PipelineProvider:
    """
    A class implementing the PipelineProvider interface provides the pipeline
    views that the Pipeline will traverse through.
    """

    def __init__(self) -> None:
        self.config: dict[str, Any] = {}

    def get_pipeline_views(self) -> Sequence[PipelineView]:
        """
        Returns a list of instantiated views which implement the PipelineView
        interface. Each view will be dispatched in order.
        >>> return [OAuthInitView(), OAuthCallbackView()]
        """
        raise NotImplementedError

    def update_config(self, config: Mapping[str, Any]) -> None:
        """
        Use update_config to allow additional provider configuration be assigned to
        the provider instance. This is useful for example when nesting
        pipelines and the provider needs to be configured differently.
        """
        self.config.update(config)

    def set_pipeline(self, pipeline: Pipeline) -> None:
        """
        Used by the pipeline to give the provider access to the executing pipeline.
        """
        self.pipeline = pipeline
