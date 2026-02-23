package com.project.entity

import jakarta.persistence.*

@Entity
@Table(name = "project")
class Project(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var name: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    var creator: User
) : BaseTimeEntity() {

    fun update(name: String, description: String?) {
        this.name = name
        this.description = description
    }
}
